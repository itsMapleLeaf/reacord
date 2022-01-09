import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../../internal/element.js"
import type { MessageOptions } from "../../internal/message"
import { Node } from "../../internal/node.js"

/**
 * Props for an action row
 * @category Action Row
 */
export type ActionRowProps = {
  children?: ReactNode
}

/**
 * An action row is a top-level container for message components.
 *
 * You don't need to use this; Reacord automatically creates action rows for you.
 * But this can be useful if you want a specific layout.
 *
 * ```tsx
 * // put buttons on two separate rows
 * <ActionRow>
 *   <Button onClick={handleFirst}>First</Button>
 * </ActionRow>
 * <Button onClick={handleSecond}>Second</Button>
 * ```
 *
 * @category Action Row
 * @see https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export function ActionRow(props: ActionRowProps) {
  return (
    <ReacordElement props={props} createNode={() => new ActionRowNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

class ActionRowNode extends Node<{}> {
  override modifyMessageOptions(options: MessageOptions): void {
    options.actionRows.push([])
    for (const child of this.children) {
      child.modifyMessageOptions(options)
    }
  }
}
