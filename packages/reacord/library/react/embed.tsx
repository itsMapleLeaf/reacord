import React from "react"
import { Node } from "../node.js"
import { ReacordElement } from "./reacord-element.js"

/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
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
  children?: React.ReactNode
}

/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
export function Embed(props: EmbedProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

export class EmbedNode extends Node<EmbedProps> {}
