import type { CommandInteraction, MessageOptions } from "discord.js"
import { MessageActionRow } from "discord.js"
import { nanoid } from "nanoid"
import { last } from "../src/helpers/last.js"
import { toUpper } from "../src/helpers/to-upper.js"
import { ButtonNode } from "./components/button.js"
import { Node } from "./node.js"
import { TextNode } from "./text-node.js"

export class RootNode extends Node {
  readonly name = "root"
  private children = new Set<Node>()

  constructor(private interaction: CommandInteraction) {
    super()
  }

  add(child: Node) {
    this.children.add(child)
  }

  clear() {
    this.children.clear()
  }

  remove(child: Node) {
    this.children.delete(child)
  }

  render() {
    this.interaction.reply(this.getMessageOptions()).catch(console.error)
  }

  private getMessageOptions(): MessageOptions {
    let content = ""
    let components: MessageActionRow[] = []

    for (const child of this.children) {
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
          customId: nanoid(),
          style: toUpper(child.props.style ?? "secondary"),
          disabled: child.props.disabled,
          emoji: child.props.emoji,
          label: child.props.label,
        })
      }
    }

    return { content, components }
  }
}
