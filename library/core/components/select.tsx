import { nanoid } from "nanoid"
import type { ReactNode } from "react"
import React from "react"
import { isInstanceOf } from "../../../helpers/is-instance-of"
import { ReacordElement } from "../../internal/element.js"
import type { ComponentInteraction } from "../../internal/interaction"
import type { ActionRow, MessageOptions } from "../../internal/message"
import { Node } from "../../internal/node.js"
import { OptionNode } from "./option-node"

export type SelectProps = {
  children?: ReactNode
  value?: string
  values?: string[]
  placeholder?: string
  multiple?: boolean
  minValues?: number
  maxValues?: number
  disabled?: boolean
  onSelect?: (event: SelectEvent) => void
  onSelectValue?: (value: string) => void
  onSelectMultiple?: (values: string[]) => void
}

export type SelectEvent = {
  values: string[]
}

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
      onSelect,
      onSelectValue,
      onSelectMultiple,
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
    if (
      interaction.type === "select" &&
      interaction.customId === this.customId &&
      !this.props.disabled
    ) {
      this.props.onSelect?.({ values: interaction.values })
      this.props.onSelectMultiple?.(interaction.values)
      if (interaction.values[0]) {
        this.props.onSelectValue?.(interaction.values[0])
      }
      return true
    }
    return false
  }
}
