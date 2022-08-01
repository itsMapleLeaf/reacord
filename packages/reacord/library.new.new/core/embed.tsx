import type { ReactNode } from "react"
import React from "react"
import type { Except } from "type-fest"

export type EmbedProps = {
  title?: string
  description?: string
  url?: string
  color?: number
  fields?: Array<{ name: string; value: string; inline?: boolean }>
  author?: { name: string; url?: string; iconUrl?: string }
  thumbnail?: { url: string }
  image?: { url: string }
  video?: { url: string }
  footer?: { text: string; iconUrl?: string }
  timestamp?: string | number | Date
  children?: ReactNode
}

export function Embed({ children, ...props }: EmbedProps) {
  return <reacord-embed {...props}>{children}</reacord-embed>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ReacordHostElementMap {
    "reacord-embed": Except<EmbedProps, "children">
  }
}
