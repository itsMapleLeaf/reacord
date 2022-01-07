import { createContext, useContext } from "react"
import type { AssetBuilder } from "../asset-builder/asset-builder.js"
import { raise } from "../helpers/raise.js"

const Context = createContext<AssetBuilder>()

export const AssetBuilderProvider = Context.Provider

export const useAssetBuilder = () =>
  useContext(Context) ?? raise("AssetBuilderProvider not found")
