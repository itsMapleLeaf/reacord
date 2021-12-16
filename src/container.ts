import type { Message, MessageOptions, TextBasedChannels } from "discord.js"
import type { ReacordElement } from "./element.js"

type Action =
  | { type: "updateMessage"; options: MessageOptions }
  | { type: "deleteMessage" }

export class ReacordContainer {
  private channel: TextBasedChannels
  private message?: Message
  private actions: Action[] = []
  private runningPromise?: Promise<void>

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  render(instances: ReacordElement[]) {
    const messageOptions: MessageOptions = {
      content: instances.join("") || undefined, // empty strings are not allowed
    }

    const hasContent = messageOptions.content !== undefined

    this.addAction(
      hasContent
        ? { type: "updateMessage", options: messageOptions }
        : { type: "deleteMessage" },
    )
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
      this.message = await (this.message
        ? this.message.edit(action.options)
        : this.channel.send(action.options))
    }

    if (action.type === "deleteMessage") {
      await this.message?.delete()
      this.message = undefined
    }
  }
}
