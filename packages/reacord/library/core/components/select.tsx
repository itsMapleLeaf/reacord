import { nanoid } from "nanoid"
import type { ReactNode } from "react"
import React from "react"
import { isInstanceOf } from "../../../helpers/is-instance-of"
import { ReacordElement } from "../../internal/element.js"
import type { ComponentInteraction } from "../../internal/interaction"
import type { ActionRow, MessageOptions } from "../../internal/message"
import { Node } from "../../internal/node.js"
import type { ComponentEvent } from "../component-event"
import { OptionNode } from "./option-node"

/**
 * @category Select
 */
export type SelectProps = {
  children?: ReactNode
  value?: string
  values?: string[]
  placeholder?: string
  multiple?: boolean
  minValues?: number
  maxValues?: number
  disabled?: boolean
  onChange?: (event: SelectChangeEvent) => void
  onChangeValue?: (value: string, event: SelectChangeEvent) => void
  onChangeMultiple?: (values: string[], event: SelectChangeEvent) => void
}

/**
 * @category Select
 */
export type SelectChangeEvent = ComponentEvent & {
  values: string[]
}

/**
 * @category Select
 */
export function Select(props: SelectProps) {
  return (
    <ReacordElement props={props} createNode={() => new SelectNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

class SelectNode extends Node<SelectProps> {
  readonly customId = nanoid()

  override modifyMessageOptions(message: MessageOptions): void {
    const actionRow: ActionRow = []
    message.actionRows.push(actionRow)

    const options = [...this.children]
      .filter(isInstanceOf(OptionNode))
      .map((node) => node.options)

    const {
      multiple,
      value,
      values,
      minValues = 0,
      maxValues = 25,
      children,
      onChange,
      onChangeValue,
      onChangeMultiple,
      ...props
    } = this.props

    actionRow.push({
      ...props,
      type: "select",
      customId: this.customId,
      options,
      values: [...(values || []), ...(value ? [value] : [])],
      minValues: multiple ? minValues : undefined,
      maxValues: multiple ? Math.max(minValues, maxValues) : undefined,
    })
  }

  override handleComponentInteraction(
    interaction: ComponentInteraction,
  ): boolean {
    const isSelectInteraction =
      interaction.type === "select" &&
      interaction.customId === this.customId &&
      !this.props.disabled

    if (!isSelectInteraction) return false

    this.props.onChange?.(interaction.event)
    this.props.onChangeMultiple?.(interaction.event.values, interaction.event)
    if (interaction.event.values[0]) {
      this.props.onChangeValue?.(interaction.event.values[0], interaction.event)
    }
    return true
  }
}
