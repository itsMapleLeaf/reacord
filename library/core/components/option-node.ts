import type { MessageSelectOptionOptions } from "../../internal/message"
import { Node } from "../../internal/node"
import type { OptionProps } from "./option"

export class OptionNode extends Node<OptionProps> {
  get options(): MessageSelectOptionOptions {
    return {
      label: this.props.children || this.props.label || this.props.value,
      value: this.props.value,
      description: this.props.description,
      emoji: this.props.emoji,
    }
  }
}
