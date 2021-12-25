import type {
  CommandInteraction,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import { MessageActionRow } from "discord.js"
import { last } from "../src/helpers/last.js"
import { toUpper } from "../src/helpers/to-upper.js"
import { ButtonNode } from "./components/button.js"
import type { Node } from "./node.js"
import { TextNode } from "./text-node.js"

export class Renderer {
  private nodes = new Set<Node | TextNode>()
  private componentInteraction?: MessageComponentInteraction

  constructor(private interaction: CommandInteraction) {}

  add(child: Node | TextNode) {
    this.nodes.add(child)
  }

  remove(child: Node | TextNode) {
    this.nodes.delete(child)
  }

  clear() {
    this.nodes.clear()
  }

  render() {
    const options = this.getMessageOptions()
    if (this.componentInteraction) {
      this.componentInteraction.update(options).catch(console.error)
      this.componentInteraction = undefined
    } else if (this.interaction.replied) {
      this.interaction.editReply(options).catch(console.error)
    } else {
      this.interaction.reply(options).catch(console.error)
    }
  }

  handleInteraction(interaction: MessageComponentInteraction) {
    if (interaction.isButton()) {
      this.componentInteraction = interaction
      this.getButtonCallback(interaction.customId)?.(interaction)
      return true
    }

    return false
  }

  private getMessageOptions(): MessageOptions {
    let content = ""
    let components: MessageActionRow[] = []

    for (const child of this.nodes) {
      if (child instanceof TextNode) {
        content += child.text
      }

      if (child instanceof ButtonNode) {
        let actionRow = last(components)
        if (
          !actionRow ||
          actionRow.components.length >= 5 ||
          actionRow.components[0]?.type === "SELECT_MENU"
        ) {
          actionRow = new MessageActionRow()
          components.push(actionRow)
        }

        actionRow.addComponents({
          type: "BUTTON",
          customId: child.customId,
          style: toUpper(child.props.style ?? "secondary"),
          disabled: child.props.disabled,
          emoji: child.props.emoji,
          label: child.props.label,
        })
      }
    }

    return { content, components }
  }

  private getButtonCallback(customId: string) {
    for (const child of this.nodes) {
      if (child instanceof ButtonNode && child.customId === customId) {
        return child.props.onClick
      }
    }
  }
}
