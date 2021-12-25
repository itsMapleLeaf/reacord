import type {
  CommandInteraction,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import { Subject } from "rxjs"
import { concatMap } from "rxjs/operators"
import { Container } from "./container.js"
import type { Node } from "./node.js"

// keep track of interaction ids which have replies,
// so we know whether to call reply() or followUp()
const repliedInteractionIds = new Set<string>()

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  private componentInteraction?: MessageComponentInteraction
  private messageId?: string
  private updates = new Subject<MessageOptions>()

  constructor(private interaction: CommandInteraction) {
    this.updates
      .pipe(concatMap((options) => this.updateMessage(options)))
      .subscribe()
  }

  render() {
    this.updates.next(this.getMessageOptions())
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

  private async updateMessage(options: MessageOptions) {
    if (this.componentInteraction) {
      const promise = this.componentInteraction.update(options)
      this.componentInteraction = undefined
      await promise
      return
    }

    if (this.messageId) {
      await this.interaction.channel?.messages.edit(this.messageId, options)
      return
    }

    if (repliedInteractionIds.has(this.interaction.id)) {
      const message = await this.interaction.followUp({
        ...options,
        fetchReply: true,
      })
      this.messageId = message.id
      return
    }

    repliedInteractionIds.add(this.interaction.id)
    const message = await this.interaction.reply({
      ...options,
      fetchReply: true,
    })
    this.messageId = message.id
  }
}
