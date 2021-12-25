import type {
  CommandInteraction,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import { Container } from "./container.js"
import type { Node } from "./node.js"

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  private componentInteraction?: MessageComponentInteraction

  constructor(private interaction: CommandInteraction) {}

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
