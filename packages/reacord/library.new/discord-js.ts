import type {
  Client,
  Interaction,
  Message,
  MessageEditOptions,
  MessageOptions,
  TextBasedChannel,
} from "discord.js"
import type { ReactNode } from "react"
import { AsyncQueue } from "./async-queue"
import type { ReacordOptions } from "./reacord"
import { ReacordInstancePool } from "./reacord"

export class ReacordDiscordJs {
  private instances

  constructor(private readonly client: Client, options: ReacordOptions = {}) {
    this.instances = new ReacordInstancePool(options)
  }

  send(channelId: string, initialContent?: ReactNode) {
    const renderer = new MessageRenderer()

    return this.instances.create({
      initialContent,
      update: async (tree) => {
        try {
          const messageOptions: MessageOptions & MessageEditOptions = {
            content: tree.children.map((child) => child.text).join(""),
          }
          const channel = await getTextChannel(this.client, channelId)
          await renderer.update(messageOptions, channel)
        } catch (error) {
          console.error("Error updating message:", error)
        }
      },
      destroy: async () => {
        try {
          await renderer.destroy()
        } catch (error) {
          console.error("Error destroying message:", error)
        }
      },
      deactivate: async () => {
        try {
          await renderer.deactivate()
        } catch (error) {
          console.error("Error deactivating message:", error)
        }
      },
    })
  }

  reply(interaction: Interaction, initialContent?: ReactNode) {}

  ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {}
}

class MessageRenderer {
  private message: Message | undefined
  private active = true
  private readonly queue = new AsyncQueue()

  update(
    options: MessageOptions & MessageEditOptions,
    channel: TextBasedChannel,
  ) {
    return this.queue.add(async () => {
      if (!this.active) return
      if (this.message) {
        await this.message.edit(options)
      } else {
        this.message = await channel.send(options)
      }
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
}

async function getTextChannel(
  client: Client<boolean>,
  channelId: string,
): Promise<TextBasedChannel> {
  const channel =
    client.channels.cache.get(channelId) ??
    (await client.channels.fetch(channelId))

  if (!channel) {
    throw new Error(`Channel ${channelId} not found`)
  }
  if (!channel.isTextBased()) {
    throw new Error(`Channel ${channelId} is not a text channel`)
  }
  return channel
}
