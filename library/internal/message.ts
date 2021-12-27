import type { Except } from "type-fest"
import { last } from "../../helpers/last"
import type { EmbedOptions } from "../core/components/embed-options"
import type { SelectProps } from "../core/components/select"

export type MessageOptions = {
  content: string
  embeds: EmbedOptions[]
  actionRows: ActionRow[]
}

export type ActionRow = Array<
  MessageButtonOptions | MessageLinkOptions | MessageSelectOptions
>

export type MessageButtonOptions = {
  type: "button"
  customId: string
  label?: string
  style?: "primary" | "secondary" | "success" | "danger"
  disabled?: boolean
  emoji?: string
}

export type MessageLinkOptions = {
  type: "link"
  url: string
  label?: string
  emoji?: string
  disabled?: boolean
}

export type MessageSelectOptions = Except<SelectProps, "children" | "value"> & {
  type: "select"
  customId: string
  options: MessageSelectOptionOptions[]
}

export type MessageSelectOptionOptions = {
  label: string
  value: string
  description?: string
  emoji?: string
}

export type Message = {
  edit(options: MessageOptions): Promise<void>
  disableComponents(): Promise<void>
}

export function getNextActionRow(options: MessageOptions): ActionRow {
  let actionRow = last(options.actionRows)
  if (
    actionRow == undefined ||
    actionRow.length >= 5 ||
    actionRow[0]?.type === "select"
  ) {
    actionRow = []
    options.actionRows.push(actionRow)
  }
  return actionRow
}
