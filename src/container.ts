import type { Message, MessageOptions, TextBasedChannels } from "discord.js"
import { createDeferred } from "./helpers/deferred.js"

type Action =
  | { type: "updateMessage"; options: MessageOptions }
  | { type: "deleteMessage" }

export class ReacordContainer {
  channel: TextBasedChannels
  message?: Message
  actions: Action[] = []
  runningPromise?: PromiseLike<void>

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  async render(instances: string[]) {
    const messageOptions: MessageOptions = {
      content: instances.join("") || undefined, // empty strings are not allowed
    }

    const hasContent = messageOptions.content !== undefined

    await this.addAction(
      hasContent
        ? { type: "updateMessage", options: messageOptions }
        : { type: "deleteMessage" },
    )
  }

  private async addAction(action: Action) {
    const lastAction = this.actions[this.actions.length - 1]
    if (lastAction?.type === action.type) {
      this.actions[this.actions.length - 1] = action
    } else {
      this.actions.push(action)
    }
    await this.runActions()
  }

  private async runActions() {
    if (this.runningPromise) {
      return this.runningPromise
    }

    const promise = (this.runningPromise = createDeferred())

    queueMicrotask(async () => {
      let action: Action | undefined
      while ((action = this.actions.shift())) {
        try {
          switch (action.type) {
            case "updateMessage":
              this.message = await (this.message
                ? this.message.edit(action.options)
                : this.channel.send(action.options))
              break
            case "deleteMessage":
              if (this.message) {
                await this.message.delete()
                this.message = undefined
              }
              break
          }
        } catch (error) {
          console.error(`Failed to run action:`, action)
          console.error(error)
        }
      }

      promise.resolve()
    })

    await promise
    this.runningPromise = undefined
  }
}
