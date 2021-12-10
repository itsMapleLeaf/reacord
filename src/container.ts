import type { Message, MessageOptions, TextBasedChannels } from "discord.js"

type Action =
  | { type: "updateMessage"; options: MessageOptions }
  | { type: "deleteMessage" }

export class ReacordContainer {
  channel: TextBasedChannels
  message?: Message
  actions: Action[] = []
  runningPromise?: Promise<void>

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

    const runAction = async (action: Action) => {
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

    this.runningPromise = new Promise((resolve) => {
      // using a microtask to allow multiple actions to be added synchronously
      queueMicrotask(async () => {
        let action: Action | undefined
        while ((action = this.actions.shift())) {
          try {
            await runAction(action)
          } catch (error) {
            console.error(`Failed to run action:`, action)
            console.error(error)
          }
        }
        resolve()
      })
    })

    await this.runningPromise
    this.runningPromise = undefined
  }

  awaitActions() {
    return this.runningPromise ?? Promise.resolve()
  }
}
