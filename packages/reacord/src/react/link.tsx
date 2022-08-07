import React from "react"
import type { Except } from "type-fest"
import { Node } from "../node.js"
import type { ButtonSharedProps } from "./button-shared-props"
import { ReacordElement } from "./reacord-element.js"

/**
 * @category Link
 */
export type LinkProps = ButtonSharedProps & {
  /** The URL the link should lead to */
  url: string
  /** The link text */
  children?: string
}

/**
 * @category Link
 */
export function Link({ label, children, ...props }: LinkProps) {
  return (
    <ReacordElement props={props} createNode={() => new LinkNode(props)}>
      {label || children}
    </ReacordElement>
  )
}

export class LinkNode extends Node<Except<LinkProps, "label" | "children">> {}
