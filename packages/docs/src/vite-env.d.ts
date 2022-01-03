/// <reference types="vite/client" />

declare module "*.md" {
  import type { ComponentType } from "react"
  export const attributes: Record<string, any>
  export const html: string
  export const ReactComponent: ComponentType
}
