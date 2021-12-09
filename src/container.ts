import type { Message, MessageOptions, TextBasedChannels } from "discord.js"

type Action =
  | { type: "updateMessage"; options: MessageOptions }
  | { type: "deleteMessage" }

export class ReacordContainer {
  channel: TextBasedChannels
  message?: Message
  actions: Action[] = []
  runningActions = false

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  render(instances: string[]) {
    const messageOptions: MessageOptions = {
      content: instances.join("") || undefined, // empty strings are not allowed
    }

    const hasContent = messageOptions.content !== undefined
    if (hasContent) {
      this.addAction({ type: "updateMessage", options: messageOptions })
    } else {
      this.addAction({ type: "deleteMessage" })
    }
  }

  private addAction(action: Action) {
    const lastAction = this.actions[this.actions.length - 1]
    if (lastAction?.type === action.type) {
      this.actions[this.actions.length - 1] = action
    } else {
      this.actions.push(action)
    }
    void this.runActions()
  }

  private runActions() {
    if (this.runningActions) return
    this.runningActions = true

    queueMicrotask(async () => {
      let action: Action | undefined
      while ((action = this.actions.shift())) {
        try {
          switch (action.type) {
            case "updateMessage":
              if (this.message) {
                await this.message.edit(action.options)
              } else {
                this.message = await this.channel.send(action.options)
              }
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

      this.runningActions = false
    })
  }
}
