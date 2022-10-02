import { AsyncQueue } from "@reacord/helpers/async-queue"
import type {
  Client,
  Message,
  RESTPostAPIInteractionFollowupResult,
  Snowflake,
} from "discord.js"
import { InteractionResponseType, Routes, TextChannel } from "discord.js"
import type { MessageUpdatePayload } from "./make-message-update-payload"
import { makeMessageUpdatePayload } from "./make-message-update-payload"
import type { Node } from "./node"
import type { InteractionInfo } from "./reacord-client"

export abstract class Renderer {
  private active = true
  private componentInteraction?: InteractionInfo
  private readonly queue = new AsyncQueue()

  constructor(protected readonly clientPromise: Promise<Client<true>>) {}

  protected abstract handleUpdate(payload: MessageUpdatePayload): Promise<void>
  protected abstract handleDestroy(): Promise<void>
  protected abstract handleDeactivate(): Promise<void>

  update(tree: Node) {
    const payload = makeMessageUpdatePayload(tree)

    this.queue
      .append(async () => {
        if (!this.active) return

        if (this.componentInteraction) {
          await this.updateInteractionMessage(
            this.componentInteraction,
            payload,
          )
          this.componentInteraction = undefined
          return
        }

        await this.handleUpdate(payload)
      })
      .catch(console.error)
  }

  destroy() {
    if (!this.active) return
    this.active = false
    this.queue.append(() => this.handleDestroy()).catch(console.error)
  }

  deactivate() {
    this.queue
      .append(async () => {
        await this.handleDeactivate()
        this.active = false
      })
      .catch(console.error)
  }

  onComponentInteraction(info: InteractionInfo) {
    this.componentInteraction = info

    // a component update might not happen in response to this interaction,
    // so we'll defer it after a timeout if it's not handled by then
    setTimeout(() => {
      this.queue
        .append(() => {
          if (!this.componentInteraction) return
          const info = this.componentInteraction
          this.componentInteraction = undefined
          return this.deferMessageUpdate(info)
        })
        .catch(console.error)
    }, 500)
  }

  private async updateInteractionMessage(
    { id, token }: InteractionInfo,
    payload: MessageUpdatePayload,
  ) {
    const client = await this.clientPromise
    await client.rest.post(Routes.interactionCallback(id, token), {
      body: {
        type: InteractionResponseType.UpdateMessage,
        data: payload,
      },
    })
  }

  private async deferMessageUpdate({ id, token }: InteractionInfo) {
    const client = await this.clientPromise
    await client.rest.post(Routes.interactionCallback(id, token), {
      body: { type: InteractionResponseType.DeferredMessageUpdate },
    })
  }
}

export class ChannelMessageRenderer extends Renderer {
  private channel?: TextChannel
  private message?: Message

  constructor(
    private readonly channelId: string,
    clientPromise: Promise<Client<true>>,
  ) {
    super(clientPromise)
  }

  override async handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    if (this.message) {
      await this.message.edit(payload)
      return
    }

    const channel = await this.getChannel()
    this.message = await channel.send(payload)
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
  private messageCreated = false

  constructor(
    private interaction: InteractionInfo,
    clientPromise: Promise<Client<true>>,
  ) {
    super(clientPromise)
  }

  async handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    const client = await this.clientPromise
    if (!this.messageCreated) {
      await client.rest.post(
        Routes.interactionCallback(this.interaction.id, this.interaction.token),
        {
          body: {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: payload,
          },
        },
      )
      this.messageCreated = true
    } else {
      await client.rest.patch(
        Routes.webhookMessage(
          client.application.id,
          this.interaction.token,
          "@original",
        ),
        { body: payload },
      )
    }
  }

  handleDestroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDeactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class InteractionFollowUpRenderer extends Renderer {
  private messageId?: Snowflake

  constructor(
    readonly interaction: InteractionInfo,
    clientPromise: Promise<Client<true>>,
  ) {
    super(clientPromise)
  }

  async handleUpdate(payload: MessageUpdatePayload): Promise<void> {
    const client = await this.clientPromise

    if (!this.messageId) {
      const response = (await client.rest.post(
        Routes.webhookMessage(client.application.id, this.interaction.token),
        { body: payload },
      )) as RESTPostAPIInteractionFollowupResult
      this.messageId = response.id
    } else {
      await client.rest.patch(
        Routes.webhookMessage(
          client.application.id,
          this.interaction.token,
          this.messageId,
        ),
        { body: payload },
      )
    }
  }

  handleDestroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  handleDeactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class EphemeralInteractionReplyRenderer extends Renderer {
  constructor(
    private readonly interaction: InteractionInfo,
    clientPromise: Promise<Client<true>>,
  ) {
    super(clientPromise)
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
