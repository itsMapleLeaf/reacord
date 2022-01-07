import express, { RequestHandler } from "express"
import { createHash } from "node:crypto"
import { mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, parse } from "node:path"

type Asset = {
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
  private library = new Map<string, Asset>()

  private constructor(
    private cacheFolder: string,
    private transformers: AssetTransformer[],
  ) {}

  static async create(cacheFolder: string, transformers: AssetTransformer[]) {
    await rm(cacheFolder, { recursive: true })
    return new AssetBuilder(cacheFolder, transformers)
  }

  async build(inputFile: string | URL, name?: string): Promise<string> {
    inputFile = normalizeAsFilePath(inputFile)

    const existing = this.library.get(inputFile)
    if (existing) {
      return existing.url
    }

    const transformResult = await this.transform(inputFile)

    const hash = createHash("sha256")
      .update(transformResult.content)
      .digest("hex")
      .slice(0, 8)

    const parsedInputFile = parse(inputFile)
    const url = `/${name || parsedInputFile.name}.${hash}${parsedInputFile.ext}`
    const outputFile = join(this.cacheFolder, url)

    await ensureWrite(outputFile, transformResult.content)
    this.library.set(inputFile, { inputFile, outputFile, url })

    return url
  }

  local(inputFile: string | URL, name?: string): string {
    inputFile = normalizeAsFilePath(inputFile)

    const asset = this.library.get(inputFile)
    if (asset) {
      return asset.url
    }

    throw this.build(inputFile, name)
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

async function ensureWrite(file: string, content: string) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}

function normalizeAsFilePath(file: string | URL) {
  return new URL(file, "file:").pathname
}
