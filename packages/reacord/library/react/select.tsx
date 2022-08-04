import type { APIMessageComponentSelectMenuInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import type { ReactNode } from "react"
import React from "react"
import { Node } from "../node.js"
import type { ComponentEvent } from "./component-event.js"
import { ReacordElement } from "./reacord-element.js"

/**
 * @category Select
 */
export type SelectProps = {
  children?: ReactNode
  /** Sets the currently selected value */
  value?: string

  /** Sets the currently selected values, for use with `multiple` */
  values?: string[]

  /** The text shown when no value is selected */
  placeholder?: string

  /** Set to true to allow multiple selected values */
  multiple?: boolean

  /**
   * With `multiple`, the minimum number of values that can be selected.
   * When `multiple` is false or not defined, this is always 1.
   *
   * This only limits the number of values that can be received by the user.
   * This does not limit the number of values that can be displayed by you.
   */
  minValues?: number

  /**
   * With `multiple`, the maximum number of values that can be selected.
   * When `multiple` is false or not defined, this is always 1.
   *
   * This only limits the number of values that can be received by the user.
   * This does not limit the number of values that can be displayed by you.
   */
  maxValues?: number

  /** When true, the select will be slightly faded, and cannot be interacted with. */
  disabled?: boolean

  /**
   * Called when the user inputs a selection.
   * Receives the entire select change event,
   * which can be used to create new replies, etc.
   */
  onChange?: (event: SelectChangeEvent) => void

  /**
   * Convenience shorthand for `onChange`, which receives the first selected value.
   */
  onChangeValue?: (value: string, event: SelectChangeEvent) => void

  /**
   * Convenience shorthand for `onChange`, which receives all selected values.
   */
  onChangeMultiple?: (values: string[], event: SelectChangeEvent) => void
}

/**
 * @category Select
 */
export type SelectChangeEvent = ComponentEvent & {
  /** The set of values that were selected by the user.
   * If `multiple`, this can have more than one value.
   */
  values: string[]

  /**
   * Event details, e.g. the user who clicked, guild member, guild id, etc.
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
   */
  interaction: APIMessageComponentSelectMenuInteraction
}

/**
 * See [the select menu guide](/guides/select-menu) for a usage example.
 * @category Select
 */
export function Select(props: SelectProps) {
  return (
    <ReacordElement props={props} createNode={() => new SelectNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

export class SelectNode extends Node<SelectProps> {
  readonly customId = randomUUID()
}
