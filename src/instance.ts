import type { Message, TextBasedChannels } from "discord.js"

export class ReacordInstance {
  message?: Message
  content: string

  constructor(content: string) {
    this.content = content
  }

  render(channel: TextBasedChannels) {
    if (this.message) {
      this.message.edit(this.content).catch(console.error)
    } else {
      channel.send(this.content).then((message) => {
        this.message = message
      }, console.error)
    }
  }

  destroy() {
    this.message?.delete().catch(console.error)
    this.message?.channel.messages.cache.delete(this.message?.id)
  }
}
