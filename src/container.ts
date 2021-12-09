import type { Message, MessageOptions, TextBasedChannels } from "discord.js"

export class ReacordContainer {
  channel: TextBasedChannels
  message?: Message

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  render(instances: string[]) {
    if (instances.length === 0) {
      if (this.message) {
        this.channel.messages.cache.delete(this.message.id)
        this.message.delete().catch(console.error)
        this.message = undefined
      }
      return
    }

    const messageOptions: MessageOptions = {
      content: instances.join(""),
    }

    if (this.message) {
      this.message.edit(messageOptions).catch(console.error)
    } else {
      this.channel.send(messageOptions).then((message) => {
        this.message = message
      }, console.error)
    }
  }

  // clear() {
  //   for (const instance of this.instances) {
  //     instance.destroy()
  //   }
  //   this.instances.clear()
  // }
}
