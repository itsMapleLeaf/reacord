import type {
  CommandInteraction,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import type { Subscription } from "rxjs"
import { Subject } from "rxjs"
import { concatMap } from "rxjs/operators"
import { Container } from "./container.js"
import type { Node } from "./node.js"

// keep track of interaction ids which have replies,
// so we know whether to call reply() or followUp()
const repliedInteractionIds = new Set<string>()

type UpdatePayload = {
  options: MessageOptions
  action: "update" | "deactivate"
}

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  private componentInteraction?: MessageComponentInteraction
  private messageId?: string
  private updates = new Subject<UpdatePayload>()
  private updateSubscription: Subscription
  private active = true

  constructor(private interaction: CommandInteraction) {
    this.updateSubscription = this.updates
      .pipe(concatMap((payload) => this.updateMessage(payload)))
      .subscribe({ error: console.error })
  }

  render() {
    if (!this.active) {
      console.warn("Attempted to update a deactivated message")
      return
    }

    this.updates.next({
      options: this.getMessageOptions(),
      action: "update",
    })
  }

  deactivate() {
    this.active = false
    this.updates.next({
      options: this.getMessageOptions(),
      action: "deactivate",
    })
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

  private async updateMessage({ options, action }: UpdatePayload) {
    if (action === "deactivate" && this.messageId) {
      this.updateSubscription.unsubscribe()

      const message = await this.interaction.channel?.messages.fetch(
        this.messageId,
      )
      if (!message) return

      for (const actionRow of message.components) {
        for (const component of actionRow.components) {
          component.setDisabled(true)
        }
      }

      await this.interaction.channel?.messages.edit(message.id, {
        components: message.components,
      })

      return
    }

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
