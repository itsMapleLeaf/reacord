import { AsyncQueue } from "@reacord/helpers/async-queue.js"
import type { Client, Message } from "discord.js"
import { TextChannel } from "discord.js"
import { makeMessageUpdatePayload } from "./make-message-update-payload.js"
import type { Node } from "./node.js"
import type { InteractionInfo } from "./reacord-client.js"

export type Renderer = {
  update(tree: Node): Promise<void>
  deactivate(): Promise<void>
  destroy(): Promise<void>
}

export class ChannelMessageRenderer implements Renderer {
  private readonly queue = new AsyncQueue()
  private channel: TextChannel | undefined
  private message: Message | undefined
  private active = true

  constructor(
    private readonly channelId: string,
    private readonly client: Promise<Client<true>>,
  ) {}

  private async getChannel(): Promise<TextChannel> {
    if (this.channel) return this.channel

    const client = await this.client

    const channel =
      client.channels.cache.get(this.channelId) ??
      (await client.channels.fetch(this.channelId))

    if (!(channel instanceof TextChannel)) {
      throw new TypeError(`Channel ${this.channelId} is not a text channel`)
    }

    this.channel = channel
    return channel
  }

  update(tree: Node) {
    const payload = makeMessageUpdatePayload(tree)
    return this.queue.add(async () => {
      if (!this.active) return
      if (this.message) {
        await this.message.edit(payload)
      } else {
        const channel = await this.getChannel()
        this.message = await channel.send(payload)
      }
    })
  }

  deactivate() {
    return this.queue.add(async () => {
      if (!this.active) return

      // TODO: disable message components

      // set active to false *after* running deactivation,
      // so that other queued operations run first,
      // and we can show the correct deactivated state
      this.active = false
    })
  }

  destroy() {
    this.active = false
    return this.queue.add(async () => {
      const message = this.message
      this.message = undefined
      await message?.delete()
    })
  }
}

export class InteractionReplyRenderer implements Renderer {
  constructor(private readonly interaction: InteractionInfo) {}

  update(tree: Node): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class EphemeralInteractionReplyRenderer implements Renderer {
  constructor(private readonly interaction: InteractionInfo) {}

  update(tree: Node): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
