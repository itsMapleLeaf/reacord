import type {
  CommandInteraction,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import type { Node } from "./node.js"

export class Renderer {
  private nodes: Array<Node<unknown>> = []
  private componentInteraction?: MessageComponentInteraction

  constructor(private interaction: CommandInteraction) {}

  add(node: Node<unknown>) {
    this.nodes.push(node)
  }

  addBefore(node: Node<unknown>, before: Node<unknown>) {
    let index = this.nodes.indexOf(before)
    if (index === -1) {
      index = this.nodes.length
    }
    this.nodes.splice(index, 0, node)
  }

  remove(node: Node<unknown>) {
    this.nodes = this.nodes.filter((n) => n !== node)
  }

  clear() {
    this.nodes = []
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
    for (const node of this.nodes) {
      this.componentInteraction = interaction
      if (node.handleInteraction(interaction)) {
        return true
      }
    }
  }

  private getMessageOptions(): MessageOptions {
    const options: MessageOptions = {
      content: "",
      embeds: [],
      components: [],
    }
    for (const node of this.nodes) {
      node.modifyMessageOptions(options)
    }
    return options
  }
}
