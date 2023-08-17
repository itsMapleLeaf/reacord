import type { EmbedProps } from "./embed"
import type { Except, SnakeCasedPropertiesDeep } from "type-fest"

export type EmbedOptions = SnakeCasedPropertiesDeep<
	Except<EmbedProps, "timestamp" | "children"> & {
		timestamp?: string
	}
>
