import { AsyncQueue } from "@reacord/helpers/async-queue.js"
import type { Client, Message } from "discord.js"
import { TextChannel } from "discord.js"
import type { MessageUpdatePayload } from "./make-message-update-payload.js"
import { makeMessageUpdatePayload } from "./make-message-update-payload.js"
import type { Node } from "./node.js"
import type { InteractionInfo } from "./reacord-client.js"

export abstract class Renderer {
  private readonly queue = new AsyncQueue()
  private active = true
  private destroyPromise?: Promise<void>

  protected abstract handleUpdate(payload: MessageUpdatePayload): Promise<void>
  protected abstract handleDestroy(): Promise<void>
  protected abstract handleDeactivate(): Promise<void>

  update(tree: Node) {
    const payload = makeMessageUpdatePayload(tree)
    return this.queue.add(async () => {
      if (!this.active) return
      await this.handleUpdate(payload)
    })
  }

  destroy() {
    if (this.destroyPromise) return this.destroyPromise
    this.active = false

    const promise = this.queue.add(() => this.handleDestroy())

    // if it failed, we'll want to try again
    promise.catch((error) => {
      console.error("Failed to destroy message:", error)
      this.destroyPromise = undefined
    })

    return (this.destroyPromise = promise)
  }

  deactivate() {
    return this.queue.add(async () => {
      if (!this.active) return

      await this.handleDeactivate()

      // set active to false *after* running deactivation,
      // so that other queued operations run first,
      // and we can show the correct deactivated state
      this.active = false
    })
  }
}

export class ChannelMessageRenderer extends Renderer {
  private channel: TextChannel | undefined
  private message: Message | undefined

  constructor(
    private readonly channelId: string,
    private readonly clientPromise: Promise<Client<true>>,
  ) {
    super()
  }

  override async handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    if (this.message) {
      await this.message.edit(payload)
    } else {
      const channel = await this.getChannel()
      this.message = await channel.send(payload)
    }
  }

  override async handleDestroy(): Promise<void> {
    const message = this.message
    this.message = undefined
    await message?.delete()
  }

  override async handleDeactivate(): Promise<void> {
    throw new Error("not implemented")
  }

  private async getChannel(): Promise<TextChannel> {
    if (this.channel) return this.channel

    const client = await this.clientPromise

    const channel =
      client.channels.cache.get(this.channelId) ??
      (await client.channels.fetch(this.channelId))

    if (!(channel instanceof TextChannel)) {
      throw new TypeError(`Channel ${this.channelId} is not a text channel`)
    }

    this.channel = channel
    return channel
  }
}

export class InteractionReplyRenderer extends Renderer {
  constructor(private readonly interaction: InteractionInfo) {
    super()
  }

  handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDestroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDeactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class EphemeralInteractionReplyRenderer extends Renderer {
  constructor(private readonly interaction: InteractionInfo) {
    super()
  }

  handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDestroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDeactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
