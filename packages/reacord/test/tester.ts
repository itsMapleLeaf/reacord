import { raise } from "@reacord/helpers/raise"
import { CategoryChannel, ChannelType, GatewayIntentBits } from "discord.js"
import { kebabCase } from "lodash-es"
import { randomBytes } from "node:crypto"
import type { ReactNode } from "react"
import { createDiscordClient } from "../src/create-discord-client"
import { ReacordClient } from "../src/main"
import { testEnv } from "./test-env"

const reacord = new ReacordClient({
  token: testEnv.TEST_BOT_TOKEN,
})

const clientPromise = createDiscordClient(testEnv.TEST_BOT_TOKEN, {
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages,
})

const categoryPromise = getCategory()

async function removeChannels() {
  const category = await categoryPromise
  for (const [, channel] of category.children.cache) {
    await channel.delete()
  }
}

async function getCategory() {
  const client = await clientPromise

  const category =
    client.channels.cache.get(testEnv.TEST_CATEGORY_ID) ??
    (await client.channels.fetch(testEnv.TEST_CATEGORY_ID))

  if (!(category instanceof CategoryChannel)) {
    throw new TypeError("Category channel not found")
  }
  return category
}

async function getTestChannel(testName: string) {
  const hash = randomBytes(16).toString("hex").slice(0, 6)
  const channelName = `${kebabCase(testName)}-${hash}`

  const category = await categoryPromise

  let channel = category.children.cache.find((the) => the.name === channelName)
  if (!channel || !channel.isTextBased()) {
    channel = await category.children.create({
      type: ChannelType.GuildText,
      name: channelName,
    })
  }

  for (const [, message] of await channel.messages.fetch()) {
    await message.delete()
  }

  return channel
}

async function render(testName: string, content?: ReactNode) {
  const channel = await getTestChannel(testName)
  await channel.sendTyping()

  const instance = reacord.send(channel.id, content)

  const result = await channel.awaitMessages({ max: 1 })
  const message = result.first() ?? raise("failed to send message")

  return { channel, message, instance }
}

export const ReacordTester = {
  render,
  removeChannels,
}
