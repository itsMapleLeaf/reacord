import type {
  Client,
  Interaction,
  Message,
  MessageEditOptions,
  MessageOptions,
  TextBasedChannel,
} from "discord.js"
import type { ReactNode } from "react"
import type { ReacordOptions } from "./reacord"
import { createReacordInstanceManager } from "./reacord"

export function createReacordDiscordJs(
  client: Client,
  options: ReacordOptions = {},
) {
  const manager = createReacordInstanceManager(options)
  return {
    send(channelId: string, initialContent?: ReactNode) {
      const messageUpdater = createMessageUpdater()
      return manager.createInstance(initialContent, async (tree) => {
        const messageOptions: MessageOptions & MessageEditOptions = {
          content: tree.children.map((child) => child.text).join(""),
        }
        const channel = await getTextChannel(client, channelId)
        await messageUpdater.update(messageOptions, channel)
      })
    },

    reply(interaction: Interaction, initialContent?: ReactNode) {},

    ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {},
  }
}

function createMessageUpdater() {
  type UpdatePayload = {
    options: MessageOptions & MessageEditOptions
    channel: TextBasedChannel
  }

  let message: Message | undefined

  const queue: UpdatePayload[] = []
  let queuePromise: Promise<void> | undefined

  async function update(
    options: MessageOptions & MessageEditOptions,
    channel: TextBasedChannel,
  ) {
    queue.push({ options, channel })

    if (queuePromise) {
      return queuePromise
    }

    queuePromise = runQueue()
    try {
      await queuePromise
    } finally {
      queuePromise = undefined
    }
  }

  async function runQueue() {
    let payload: UpdatePayload | undefined
    while ((payload = queue.shift())) {
      if (message) {
        await message.edit(payload.options)
      } else {
        message = await payload.channel.send(payload.options)
      }
    }
  }

  return { update }
}

async function getTextChannel(client: Client<boolean>, channelId: string) {
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
