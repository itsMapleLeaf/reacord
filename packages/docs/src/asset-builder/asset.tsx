import React, { ReactNode } from "react"
import { normalizeAsFilePath } from "../helpers/filesystem.js"
import { useAssetBuilder } from "./asset-builder-context.js"
import { Asset, AssetBuilder } from "./asset-builder.js"

type AssetState =
  | { status: "building"; promise: Promise<unknown> }
  | { status: "built"; asset: Asset }

const cache = new Map<string, AssetState>()

function useAssetBuild(
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

  return state.asset.url
}

export function LocalFileAsset({
  from,
  as: name,
  children,
}: {
  from: string | URL
  as?: string
  children: (url: string) => ReactNode
}) {
  const inputFile = normalizeAsFilePath(from)

  const url = useAssetBuild(inputFile, (builder) => {
    return builder.build(inputFile, name)
  })

  return <>{children(url)}</>
}

export function ModuleAsset({
  from,
  as: name,
  children,
}: {
  from: string
  as?: string
  children: (url: string) => ReactNode
}) {
  const cacheKey = `node:${from}`

  const url = useAssetBuild(cacheKey, async (builder) => {
    const inputFile = await import.meta.resolve!(from)
    return await builder.build(inputFile, name)
  })

  return <>{children(url)}</>
}
