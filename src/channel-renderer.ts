import type {
  InteractionCollector,
  Message,
  MessageComponentInteraction,
  MessageComponentType,
  TextBasedChannels,
} from "discord.js"
import type { Action } from "./action-queue.js"
import { ActionQueue } from "./action-queue.js"
import { collectInteractionHandlers } from "./collect-interaction-handlers"
import { createMessageOptions } from "./create-message-options"
import type { MessageNode } from "./node.js"

export class ChannelRenderer {
  private channel: TextBasedChannels
  private interactionCollector: InteractionCollector<MessageComponentInteraction>
  private message?: Message
  private tree?: MessageNode
  private actions = new ActionQueue()

  constructor(channel: TextBasedChannels) {
    this.channel = channel
    this.interactionCollector = this.createInteractionCollector()
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
        interaction.deferUpdate().catch(console.error)
        handler.onClick(interaction)
      }
    })

    return collector as InteractionCollector<MessageComponentInteraction>
  }

  render(node: MessageNode) {
    this.actions.add(this.createUpdateMessageAction(node))
  }

  destroy() {
    this.actions.clear()
    this.actions.add(this.createDeleteMessageAction())
    this.interactionCollector.stop()
  }

  done() {
    return this.actions.done()
  }

  private createUpdateMessageAction(node: MessageNode): Action {
    return {
      id: "updateMessage",
      priority: 0,
      run: async () => {
        const options = createMessageOptions(node)

        // eslint-disable-next-line unicorn/prefer-ternary
        if (this.message) {
          this.message = await this.message.edit({
            ...options,

            // need to ensure that the proper fields are erased if there's no content
            // eslint-disable-next-line unicorn/no-null
            content: options.content ?? null,
            // eslint-disable-next-line unicorn/no-null
            embeds: options.embeds ?? [],
          })
        } else {
          this.message = await this.channel.send(options)
        }
      },
    }
  }

  private createDeleteMessageAction(): Action {
    return {
      id: "deleteMessage",
      priority: 0,
      run: () => this.message?.delete(),
    }
  }
}
