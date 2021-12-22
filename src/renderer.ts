import type {
  InteractionCollector,
  Message,
  MessageComponentInteraction,
  MessageComponentType,
  TextBasedChannels,
} from "discord.js"
import type { MessageNode } from "./node-tree.js"
import { collectInteractionHandlers, getMessageOptions } from "./node-tree.js"

type Action =
  | { type: "updateMessage"; tree: MessageNode }
  | { type: "deleteMessage" }

export class MessageRenderer {
  private channel: TextBasedChannels
  private interactionCollector: InteractionCollector<MessageComponentInteraction>
  private message?: Message
  private tree?: MessageNode
  private actions: Action[] = []
  private runningPromise?: Promise<void>

  constructor(channel: TextBasedChannels) {
    this.channel = channel
    this.interactionCollector =
      this.createInteractionCollector() as InteractionCollector<MessageComponentInteraction>
  }

  private getInteractionHandler(customId: string) {
    if (!this.tree) return undefined
    const handlers = collectInteractionHandlers(this.tree)
    return handlers.find((handler) => handler.customId === customId)
  }

  private createInteractionCollector() {
    const collector =
      this.channel.createMessageComponentCollector<MessageComponentType>({
        filter: (interaction) =>
          !!this.getInteractionHandler(interaction.customId),
      })

    collector.on("collect", (interaction) => {
      const handler = this.getInteractionHandler(interaction.customId)
      if (handler?.type === "button" && interaction.isButton()) {
        handler.onClick(interaction)
      }
    })

    return collector
  }

  render(node: MessageNode) {
    this.addAction({
      type: "updateMessage",
      tree: node,
    })
  }

  destroy() {
    this.actions = []
    this.addAction({ type: "deleteMessage" })
    this.interactionCollector.stop()
  }

  completion() {
    return this.runningPromise ?? Promise.resolve()
  }

  private addAction(action: Action) {
    const lastAction = this.actions[this.actions.length - 1]
    if (lastAction?.type === action.type) {
      this.actions[this.actions.length - 1] = action
    } else {
      this.actions.push(action)
    }
    this.runActions()
  }

  private runActions() {
    if (this.runningPromise) return

    this.runningPromise = new Promise((resolve) => {
      // using a microtask to allow multiple actions to be added synchronously
      queueMicrotask(async () => {
        let action: Action | undefined
        while ((action = this.actions.shift())) {
          try {
            await this.runAction(action)
          } catch (error) {
            console.error(`Failed to run action:`, action)
            console.error(error)
          }
        }
        resolve()
        this.runningPromise = undefined
      })
    })
  }

  private async runAction(action: Action) {
    if (action.type === "updateMessage") {
      const options = getMessageOptions(action.tree)
      // eslint-disable-next-line unicorn/prefer-ternary
      if (this.message) {
        this.message = await this.message.edit({
          ...options,

          // need to ensure that, if there's no text, it's erased
          // eslint-disable-next-line unicorn/no-null
          content: options.content ?? null,
        })
      } else {
        this.message = await this.channel.send(options)
      }
      this.tree = action.tree
    }

    if (action.type === "deleteMessage") {
      await this.message?.delete()
      this.message = undefined
    }
  }
}
