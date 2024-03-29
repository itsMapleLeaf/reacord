import type { MessageSelectOptionOptions } from "../../internal/message"
import { Node } from "../../internal/node"
import type { OptionProps } from "./option"

export class OptionNode extends Node<
	Omit<OptionProps, "children" | "label" | "description">
> {
	get options(): MessageSelectOptionOptions {
		return {
			label: this.children.findType(OptionLabelNode)?.text ?? this.props.value,
			value: this.props.value,
			description: this.children.findType(OptionDescriptionNode)?.text,
			emoji: this.props.emoji,
		}
	}
}

export class OptionLabelNode extends Node<Record<string, never>> {}
export class OptionDescriptionNode extends Node<Record<string, never>> {}
