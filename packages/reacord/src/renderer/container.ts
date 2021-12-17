import type { Message, MessageOptions, TextBasedChannels } from "discord.js"
import type { TextElementInstance } from "./text-element-instance.js"
import type { TextInstance } from "./text-instance.js"

type Action =
  | { type: "updateMessage"; options: MessageOptions }
  | { type: "deleteMessage" }

type ReacordContainerChild = TextElementInstance | TextInstance

export class ReacordContainer {
  private channel: TextBasedChannels
  private message?: Message
  private actions: Action[] = []
  private runningPromise?: Promise<void>
  private instances = new Set<ReacordContainerChild>()

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  add(instance: ReacordContainerChild) {
    this.instances.add(instance)
    this.render()
  }

  remove(instance: ReacordContainerChild) {
    this.instances.delete(instance)
    this.render()
  }

  clear() {
    this.instances.clear()
    this.render()
  }

  render() {
    const messageOptions: MessageOptions = {}
    for (const instance of this.instances) {
      instance.render(messageOptions)
    }

    // can't render an empty message
    if (!messageOptions.content) {
      this.addAction({ type: "deleteMessage" })
    } else {
      this.addAction({ type: "updateMessage", options: messageOptions })
    }
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
