import type { ReactNode } from "react"
import React from "react"
import type { Except } from "type-fest"
import { Node } from "../node"
import { ReacordElement } from "./reacord-element"

/**
 * @category Embed
 */
export type EmbedTitleProps = {
  children: ReactNode
  url?: string
}

/**
 * @category Embed
 */
export function EmbedTitle({ children, ...props }: EmbedTitleProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedTitleNode(props)}>
      {children}
    </ReacordElement>
  )
}

export class EmbedTitleNode extends Node<Except<EmbedTitleProps, "children">> {}
