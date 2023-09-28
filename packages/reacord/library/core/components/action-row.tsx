import type { ReactNode } from "react"
import { ReacordElement } from "../../internal/element.js"
import type { MessageOptions } from "../../internal/message"
import { Node } from "../../internal/node.js"
import type { ComponentInteraction } from "../../internal/interaction.js"

/**
 * Props for an action row
 *
 * @category Action Row
 */
export interface ActionRowProps {
	children?: ReactNode
}

/**
 * An action row is a top-level container for message components.
 *
 * You don't need to use this; Reacord automatically creates action rows for
 * you. But this can be useful if you want a specific layout.
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
		<ReacordElement props={props} createNode={() => new ActionRowNode(props)}>
			{props.children}
		</ReacordElement>
	)
}

class ActionRowNode extends Node<ActionRowProps> {
	override modifyMessageOptions(options: MessageOptions): void {
		options.actionRows.push([])
		for (const child of this.children) {
			child.modifyMessageOptions(options)
		}
	}
	handleComponentInteraction(interaction: ComponentInteraction) {
		for (const child of this.children) {
			if (child.handleComponentInteraction(interaction)) {
				return true
			}
		}
		return false
	}
}
