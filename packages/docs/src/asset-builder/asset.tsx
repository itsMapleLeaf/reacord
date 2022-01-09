import type { ReactNode } from "react";
import React from "react"
import { normalizeAsFilePath } from "../helpers/filesystem.js"
import { useAssetBuilder } from "./asset-builder-context.js"
import type { AssetBuilder, AssetTransformer } from "./asset-builder.js"

type AssetState =
  | { status: "building"; promise: Promise<unknown> }
  | { status: "built"; asset: unknown }

const cache = new Map<string, AssetState>()

function useAssetBuild<Asset>(
  cacheKey: string,
  build: (builder: AssetBuilder) => Promise<Asset>,
) {
  const builder = useAssetBuilder()

  const state = cache.get(cacheKey)
  if (!state) {
    const promise = build(builder).then((asset) => {
      cache.set(cacheKey, { status: "built", asset })
    })

    cache.set(cacheKey, { status: "building", promise })
    throw promise
  }

  if (state.status === "building") {
    throw state.promise
  }

  return state.asset as Asset
}

export function LocalFileAsset<Asset>({
  from,
  using: transformer,
  as: alias,
  children,
}: {
  from: string | URL
  using: AssetTransformer<Asset>
  as?: string
  children: (url: Asset) => ReactNode
}) {
  const inputFile = normalizeAsFilePath(from)

  const asset = useAssetBuild(inputFile, (builder) => {
    return builder.build(inputFile, transformer, alias)
  })

  return <>{children(asset)}</>
}

export function ModuleAsset<Asset>({
  from,
  using: transformer,
  as: name,
  children,
}: {
  from: string
  using: AssetTransformer<Asset>
  as?: string
  children: (url: Asset) => ReactNode
}) {
  const cacheKey = `node:${from}`

  const asset = useAssetBuild(cacheKey, async (builder) => {
    const inputFile = await import.meta.resolve!(from)
    return await builder.build(inputFile, transformer, name)
  })

  return <>{children(asset)}</>
}
