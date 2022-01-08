import type { RequestHandler } from "express"
import express from "express"
import { createHash } from "node:crypto"
import { mkdir, rm } from "node:fs/promises"
import { join, parse } from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ssrPrepass from "react-ssr-prepass"
import { Promisable } from "type-fest"
import { ensureWrite, normalizeAsFilePath } from "../helpers/filesystem.js"
import { AssetBuilderProvider } from "./asset-builder-context.js"

export type AssetTransformer<Asset> = {
  transform: (context: AssetTransformContext) => Promise<Asset>
}

export class AssetBuilder {
  private constructor(private cacheFolder: string) {}

  static async create(cacheFolder: string) {
    if (process.env.NODE_ENV !== "production") {
      await rm(cacheFolder, { recursive: true }).catch(() => {})
    }
    await mkdir(cacheFolder, { recursive: true })
    return new AssetBuilder(cacheFolder)
  }

  async build<Asset>(
    input: Promisable<string | URL>,
    transformer: AssetTransformer<Asset>,
    alias?: string,
  ): Promise<Asset> {
    const inputFile = normalizeAsFilePath(await input)
    // TODO: cache assets by inputFile in production

    return transformer.transform(
      new AssetTransformContext({
        inputFile,
        cacheFolder: this.cacheFolder,
        alias: alias || parse(inputFile).name,
      }),
    )
  }

  async render(element: React.ReactElement) {
    element = (
      <AssetBuilderProvider value={this}>
        <React.Suspense fallback={<></>}>{element}</React.Suspense>
      </AssetBuilderProvider>
    )
    await ssrPrepass(element)
    return `<!DOCTYPE html>\n${renderToStaticMarkup(element)}`
  }

  middleware(): RequestHandler {
    return express.static(this.cacheFolder, {
      immutable: true,
      maxAge: "1y",
    })
  }
}

export type AssetTransformOptions = {
  inputFile: string
  cacheFolder: string
  alias: string
}

export class AssetTransformContext {
  constructor(private options: AssetTransformOptions) {}

  get inputFile() {
    return this.options.inputFile
  }

  get cacheFolder() {
    return this.options.cacheFolder
  }

  get alias() {
    return this.options.alias
  }

  getOutputFileName(content: string) {
    const { ext } = parse(this.inputFile)
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 8)
    return `${this.alias}.${hash}${ext}`
  }

  async writeOutputFile(content: string) {
    const outputFileName = this.getOutputFileName(content)
    const outputFile = join(this.cacheFolder, outputFileName)
    await ensureWrite(outputFile, content)
    return { outputFileName, outputFile }
  }
}
