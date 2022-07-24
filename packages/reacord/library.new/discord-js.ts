import type {
  Client,
  Interaction,
  Message,
  MessageEditOptions,
  MessageOptions,
  TextBasedChannel,
} from "discord.js"
import type { ReactNode } from "react"
import { createAsyncQueue } from "./async-queue"
import type { ReacordOptions } from "./reacord"
import { createReacordInstanceManager } from "./reacord"

export function createReacordDiscordJs(
  client: Client,
  options: ReacordOptions = {},
) {
  const manager = createReacordInstanceManager(options)
  return {
    send(channelId: string, initialContent?: ReactNode) {
      const handler = createMessageHandler()
      return manager.createInstance({
        initialContent,
        update: async (tree) => {
          const messageOptions: MessageOptions & MessageEditOptions = {
            content: tree.children.map((child) => child.text).join(""),
          }
          const channel = await getTextChannel(client, channelId)
          await handler.update(messageOptions, channel)
        },
        destroy: () => handler.destroy(),
        deactivate: () => handler.deactivate(),
      })
    },

    reply(interaction: Interaction, initialContent?: ReactNode) {},

    ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {},
  }
}

function createMessageHandler() {
  let message: Message | undefined
  let active = true
  const queue = createAsyncQueue()

  async function update(
    options: MessageOptions & MessageEditOptions,
    channel: TextBasedChannel,
  ) {
    return queue.add(async () => {
      if (!active) return
      if (message) {
        await message.edit(options)
      } else {
        message = await channel.send(options)
      }
    })
  }

  async function destroy() {
    return queue.add(async () => {
      active = false
      await message?.delete()
    })
  }

  async function deactivate() {
    return queue.add(async () => {
      active = false
      // TODO: disable message components
    })
  }

  return { update, destroy, deactivate }
}

async function getTextChannel(
  client: Client<boolean>,
  channelId: string,
): Promise<TextBasedChannel> {
  let channel = client.channels.cache.get(channelId)
  if (!channel) {
    channel = (await client.channels.fetch(channelId)) ?? undefined
  }
  if (!channel) {
    throw new Error(`Channel ${channelId} not found`)
  }
  if (!channel.isTextBased()) {
    throw new Error(`Channel ${channelId} is not a text channel`)
  }
  return channel
}
