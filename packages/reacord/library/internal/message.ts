import type { EmbedOptions } from "../core/components/embed-options"
import type { SelectProps } from "../core/components/select"
import { last } from "@reacord/helpers/last"
import type { Except } from "type-fest"

export interface MessageOptions {
	content: string
	embeds: EmbedOptions[]
	actionRows: ActionRow[]
}

export type ActionRow = ActionRowItem[]

export type ActionRowItem =
	| MessageButtonOptions
	| MessageLinkOptions
	| MessageSelectOptions

export interface MessageButtonOptions {
	type: "button"
	customId: string
	label?: string
	style?: "primary" | "secondary" | "success" | "danger"
	disabled?: boolean
	emoji?: string
}

export interface MessageLinkOptions {
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

export interface MessageSelectOptionOptions {
	label: string
	value: string
	description?: string
	emoji?: string
}

export interface Message {
	edit(options: MessageOptions): Promise<void>
	delete(): Promise<void>
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
