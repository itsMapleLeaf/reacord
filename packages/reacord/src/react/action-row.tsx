import type { ReactNode } from "react"
import React from "react"
import { Node } from "../node"
import { ReacordElement } from "./reacord-element"

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
 *   <Button label="First" onClick={handleFirst} />
 * </ActionRow>
 * <Button label="Second" onClick={handleSecond} />
 * ```
 *
 * @category Action Row
 * @see https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export function ActionRow(props: ActionRowProps) {
  return (
    <ReacordElement props={{}} createNode={() => new ActionRowNode({})}>
      {props.children}
    </ReacordElement>
  )
}

export class ActionRowNode extends Node<{}> {}
