import type { RequestHandler } from "express"
import express from "express"
import { createHash } from "node:crypto"
import { mkdir, rm } from "node:fs/promises"
import { join, parse } from "node:path"
import { Promisable } from "type-fest"
import { ensureWrite, normalizeAsFilePath } from "../helpers/filesystem.js"

export type Asset = {
  inputFile: string
  outputFile: string
  url: string
}

export type AssetTransformer = {
  transform: (inputFile: string) => Promise<AssetTransformResult | undefined>
}

export type AssetTransformResult = {
  content: string
  type: string
}

export class AssetBuilder {
  private constructor(
    private cacheFolder: string,
    private transformers: AssetTransformer[],
  ) {}

  static async create(cacheFolder: string, transformers: AssetTransformer[]) {
    if (process.env.NODE_ENV !== "production") {
      await rm(cacheFolder, { recursive: true }).catch(() => {})
    }
    await mkdir(cacheFolder, { recursive: true })
    return new AssetBuilder(cacheFolder, transformers)
  }

  async build(input: Promisable<string | URL>, name?: string): Promise<Asset> {
    const inputFile = normalizeAsFilePath(await input)

    const transformResult = await this.transform(inputFile)

    const hash = createHash("sha256")
      .update(transformResult.content)
      .digest("hex")
      .slice(0, 8)

    const parsedInputFile = parse(inputFile)
    const url = `/${name || parsedInputFile.name}.${hash}${parsedInputFile.ext}`
    const outputFile = join(this.cacheFolder, url)

    await ensureWrite(outputFile, transformResult.content)

    return { inputFile, outputFile, url }
  }

  middleware(): RequestHandler {
    return express.static(this.cacheFolder, {
      immutable: true,
      maxAge: "1y",
    })
  }

  private async transform(inputFile: string) {
    for (const transformer of this.transformers) {
      const result = await transformer.transform(inputFile)
      if (result) return result
    }
    throw new Error(`No transformers found for ${inputFile}`)
  }
}
