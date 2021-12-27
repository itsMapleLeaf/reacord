import type { Subscription } from "rxjs"
import { Subject } from "rxjs"
import { concatMap } from "rxjs/operators"
import { Container } from "./container.js"
import type { CommandInteraction, ComponentInteraction } from "./interaction"
import type { Message, MessageOptions } from "./message"
import type { Node } from "./node.js"

// keep track of interaction ids which have replies,
// so we know whether to call reply() or followUp()
const repliedInteractionIds = new Set<string>()

type UpdatePayload =
  | { action: "update" | "deactivate"; options: MessageOptions }
  | { action: "destroy" }

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  private componentInteraction?: ComponentInteraction
  private message?: Message
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

  destroy() {
    this.active = false
    this.updates.next({ action: "destroy" })
  }

  handleComponentInteraction(interaction: ComponentInteraction) {
    this.componentInteraction = interaction
    for (const node of this.nodes) {
      if (node.handleComponentInteraction(interaction)) {
        return true
      }
    }
  }

  private getMessageOptions(): MessageOptions {
    const options: MessageOptions = {
      content: "",
      embeds: [],
      actionRows: [],
    }
    for (const node of this.nodes) {
      node.modifyMessageOptions(options)
    }
    return options
  }

  private async updateMessage(payload: UpdatePayload) {
    if (payload.action === "destroy") {
      this.updateSubscription.unsubscribe()
      await this.message?.delete()
      return
    }

    if (payload.action === "deactivate") {
      this.updateSubscription.unsubscribe()
      await this.message?.disableComponents()
      return
    }

    if (this.componentInteraction) {
      const promise = this.componentInteraction.update(payload.options)
      this.componentInteraction = undefined
      await promise
      return
    }

    if (this.message) {
      await this.message.edit(payload.options)
      return
    }

    if (repliedInteractionIds.has(this.interaction.id)) {
      this.message = await this.interaction.followUp(payload.options)
      return
    }

    repliedInteractionIds.add(this.interaction.id)
    this.message = await this.interaction.reply(payload.options)
  }
}
