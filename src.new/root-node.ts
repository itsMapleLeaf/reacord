import type { CommandInteraction, MessageOptions } from "discord.js"
import type { TextNode } from "./text-node.js"

export class RootNode {
  private children = new Set<TextNode>()

  constructor(private interaction: CommandInteraction) {}

  add(child: TextNode) {
    this.children.add(child)
  }

  clear() {
    this.children.clear()
  }

  remove(child: TextNode) {
    this.children.delete(child)
  }

  render() {
    this.interaction.reply(this.getMessageOptions()).catch(console.error)
  }

  getMessageOptions() {
    const options: MessageOptions = {}

    for (const child of this.children) {
      options.content = (options.content ?? "") + child.text
    }

    return options
  }
}
