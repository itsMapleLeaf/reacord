import type { Except, SnakeCasedPropertiesDeep } from "type-fest"
import type { EmbedProps } from "./embed"

export type EmbedOptions = SnakeCasedPropertiesDeep<
  Except<EmbedProps, "timestamp" | "children"> & {
    timestamp?: string
  }
>
