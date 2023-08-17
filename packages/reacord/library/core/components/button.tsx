import { randomUUID } from "node:crypto"
import { ReacordElement } from "../../internal/element.js"
import type { ComponentInteraction } from "../../internal/interaction"
import type { MessageOptions } from "../../internal/message"
import { getNextActionRow } from "../../internal/message"
import { Node } from "../../internal/node.js"
import type { ComponentEvent } from "../component-event"
import type { ButtonSharedProps } from "./button-shared-props"

/** @category Button */
export type ButtonProps = ButtonSharedProps & {
	/**
	 * The style determines the color of the button and signals intent.
	 *
	 * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
	 */
	style?: "primary" | "secondary" | "success" | "danger"

	/** Happens when a user clicks the button. */
	onClick: (event: ButtonClickEvent) => void
}

/** @category Button */
export type ButtonClickEvent = ComponentEvent

/** @category Button */
export function Button(props: ButtonProps) {
	return (
		<ReacordElement props={props} createNode={() => new ButtonNode(props)}>
			<ReacordElement props={{}} createNode={() => new ButtonLabelNode({})}>
				{props.label}
			</ReacordElement>
		</ReacordElement>
	)
}

class ButtonNode extends Node<ButtonProps> {
	private customId = randomUUID()

	// this has text children, but buttons themselves shouldn't yield text
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	override get text() {
		return ""
	}

	override modifyMessageOptions(options: MessageOptions): void {
		getNextActionRow(options).push({
			type: "button",
			customId: this.customId,
			style: this.props.style ?? "secondary",
			disabled: this.props.disabled,
			emoji: this.props.emoji,
			label: this.children.findType(ButtonLabelNode)?.text,
		})
	}

	override handleComponentInteraction(interaction: ComponentInteraction) {
		if (
			interaction.type === "button" &&
			interaction.customId === this.customId
		) {
			this.props.onClick(interaction.event)
			return true
		}
		return false
	}
}

class ButtonLabelNode extends Node<Record<string, never>> {}
