import { RequestHandler } from "express"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { mkdir, stat, writeFile } from "node:fs/promises"
import { dirname, extname, join, parse } from "node:path"

export type Asset = {
  file: string
  url: string
  content: Buffer
}

export type AssetTransformer = {
  transform: (asset: Asset) => Promise<AssetTransformResult | undefined>
}

export type AssetTransformResult = {
  content: string
  type: string
}

export class AssetBuilder {
  // map of asset urls to asset objects
  private library = new Map<string, Asset>()

  constructor(
    private cacheFolder: string,
    private transformers: AssetTransformer[],
  ) {}

  // accepts a path to a file, then returns a url to where the built file will be served
  // the url will include a hash of the file contents
  file(file: string | URL): string {
    if (file instanceof URL) {
      file = file.pathname
    }

    const existing = this.library.get(file)
    if (existing) {
      return existing.url
    }

    const content = readFileSync(file)
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 8)

    const { name, ext } = parse(file)
    const url = `/${name}.${hash}${ext}`
    this.library.set(url, { file, url, content })
    return url
  }

  middleware(): RequestHandler {
    return async (req, res, next) => {
      try {
        const asset = this.library.get(req.path)
        if (!asset) return next()

        const file = join(this.cacheFolder, asset.url)
        const extension = extname(file)

        const stats = await stat(file).catch(() => undefined)
        if (!stats?.isFile()) {
          const transformResult = await this.transform(asset)
          if (!transformResult) return next()

          await mkdir(dirname(file), { recursive: true })
          await writeFile(file, transformResult.content)
        }

        res
          .status(200)
          .type(extension.endsWith("tsx") ? "text/javascript" : extension)
          .header("Cache-Control", "public, max-age=604800, immutable")
          .sendFile(file)
      } catch (error) {
        next(error)
      }
    }
  }

  private async transform(asset: Asset) {
    for (const transformer of this.transformers) {
      const result = await transformer.transform(asset)
      if (result) return result
    }
  }
}
