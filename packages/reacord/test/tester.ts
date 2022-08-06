import { raise } from "@reacord/helpers/raise"
import type { Client } from "discord.js"
import { CategoryChannel, ChannelType, GatewayIntentBits } from "discord.js"
import { kebabCase } from "lodash-es"
import { randomBytes } from "node:crypto"
import type { ReactNode } from "react"
import { createDiscordClient } from "../library/create-discord-client"
import { ReacordClient } from "../library/reacord-client"
import { testEnv } from "./test-env"

export class ReacordTester {
  private static client?: Client

  static async removeChannels() {
    const client = await ReacordTester.getClient()
    const category = await ReacordTester.getCategory(client)
    for (const [, channel] of category.children.cache) {
      await channel.delete()
    }
  }

  static async create() {
    const client = await ReacordTester.getClient()
    const category = await ReacordTester.getCategory(client)
    return new ReacordTester(client, category)
  }

  private static async getClient() {
    return (this.client ??= await createDiscordClient(testEnv.TEST_BOT_TOKEN, {
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages,
    }))
  }

  private static async getCategory(client: Client<true>) {
    const category =
      client.channels.cache.get(testEnv.TEST_CATEGORY_ID) ??
      (await client.channels.fetch(testEnv.TEST_CATEGORY_ID))

    if (!(category instanceof CategoryChannel)) {
      throw new TypeError("Category channel not found")
    }
    return category
  }

  private reacord?: ReacordClient

  constructor(readonly client: Client, readonly category: CategoryChannel) {}

  private async getTestChannel(testName: string) {
    const hash = randomBytes(16).toString("hex").slice(0, 6)
    const channelName = `${kebabCase(testName)}-${hash}`

    let channel = this.category.children.cache.find(
      (the) => the.name === channelName,
    )
    if (!channel || !channel.isTextBased()) {
      channel = await this.category.children.create({
        type: ChannelType.GuildText,
        name: channelName,
      })
    }

    for (const [, message] of await channel.messages.fetch()) {
      await message.delete()
    }

    return channel
  }

  async render(testName: string, content?: ReactNode) {
    this.reacord ??= new ReacordClient({
      token: testEnv.TEST_BOT_TOKEN,
    })

    const channel = await this.getTestChannel(testName)
    await channel.sendTyping()

    const instance = this.reacord.send(channel.id, content)

    const result = await channel.awaitMessages({ max: 1 })
    const message = result.first() ?? raise("failed to send message")

    return { channel, message, instance }
  }
}
