import type { Client, Message, TextBasedChannel } from "discord.js"
import { AsyncQueue } from "../../helpers/async-queue"
import { makeMessageUpdatePayload } from "../core/make-message-payload"
import type { Node } from "../core/node"
import type { ReacordMessageRenderer } from "../core/reacord-instance-pool"

export class ChannelMessageRenderer implements ReacordMessageRenderer {
  private message: Message | undefined
  private channel: TextBasedChannel | undefined
  private active = true
  private readonly queue = new AsyncQueue()

  constructor(
    private readonly client: Client,
    private readonly channelId: string,
  ) {}

  update(root: Node) {
    return this.queue.add(async () => {
      const { content, embeds, components } = makeMessageUpdatePayload(root)

      if (!this.active) {
        return
      }

      if (this.message) {
        await this.message.edit({ content, embeds, components })
        return
      }

      const channel = await this.getChannel()
      this.message = await channel.send({ content, embeds, components })
    })
  }

  destroy() {
    return this.queue.add(async () => {
      this.active = false
      await this.message?.delete()
    })
  }

  deactivate() {
    return this.queue.add(async () => {
      this.active = false
      // TODO: disable message components
    })
  }

  private async getChannel() {
    if (this.channel) {
      return this.channel
    }

    const channel =
      this.client.channels.cache.get(this.channelId) ??
      (await this.client.channels.fetch(this.channelId))

    if (!channel) {
      throw new Error(`Channel ${this.channelId} not found`)
    }
    if (!channel.isTextBased()) {
      throw new Error(`Channel ${this.channelId} is not a text channel`)
    }
    return (this.channel = channel)
  }
}
