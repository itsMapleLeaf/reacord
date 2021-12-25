import type { ReactNode } from "react"
import React from "react"

export type TextProps = {
  children?: ReactNode
}

export const TextTag = "reacord-text"

export function Text(props: TextProps) {
  return React.createElement(TextTag, props)
}

export class TextElementNode {}
