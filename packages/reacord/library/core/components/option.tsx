import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../../internal/element"
import {
  OptionDescriptionNode,
  OptionLabelNode,
  OptionNode,
} from "./option-node"

/**
 * @category Select
 */
export type OptionProps = {
  /** The internal value of this option */
  value: string
  /** The text shown to the user. This takes priority over `children` */
  label?: ReactNode
  /** The text shown to the user */
  children?: ReactNode
  /** Description for the option, shown to the user */
  description?: ReactNode

  /**
   * Renders an emoji to the left of the text.
   *
   * Has to be a literal emoji character (e.g. 🍍),
   * or an emoji code, like `<:plus_one:778531744860602388>`.
   *
   * To get an emoji code, type your emoji in Discord chat
   * with a backslash `\` in front.
   * The bot has to be in the emoji's guild to use it.
   */
  emoji?: string
}

/**
 * @category Select
 */
export function Option({
  label,
  children,
  description,
  ...props
}: OptionProps) {
  return (
    <ReacordElement props={props} createNode={() => new OptionNode(props)}>
      {(label !== undefined || children !== undefined) && (
        <ReacordElement props={{}} createNode={() => new OptionLabelNode({})}>
          {label || children}
        </ReacordElement>
      )}
      {description !== undefined && (
        <ReacordElement
          props={{}}
          createNode={() => new OptionDescriptionNode({})}
        >
          {description}
        </ReacordElement>
      )}
    </ReacordElement>
  )
}
