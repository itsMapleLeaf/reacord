import test from "ava"
import { Client, TextChannel } from "discord.js"
import { nanoid } from "nanoid"
import { setTimeout } from "node:timers/promises"
import { raise } from "./helpers/raise.js"
import { waitForWithTimeout } from "./helpers/wait-for-with-timeout.js"
import { render } from "./render.js"
import { testBotToken, testChannelId } from "./test-environment.js"

const client = new Client({
  intents: ["GUILDS"],
})

let channel: TextChannel

test.before(async () => {
  await client.login(testBotToken)

  const result =
    client.channels.cache.get(testChannelId) ??
    (await client.channels.fetch(testChannelId)) ??
    raise("Channel not found")

  if (!(result instanceof TextChannel)) {
    throw new TypeError("Channel must be a text channel")
  }

  channel = result
})

test.after(() => {
  client.destroy()
})

test.serial("rendering text", async (t) => {
  const content = nanoid()
  const root = render(content, channel)

  await waitForWithTimeout(
    async () => {
      const messages = await channel.messages.fetch()
      return messages.some((m) => m.content === content)
    },
    10_000,
    "Message not found",
  )

  const newContent = nanoid()
  root.rerender(newContent)

  await waitForWithTimeout(
    async () => {
      const messages = await channel.messages.fetch()
      return messages.some((m) => m.content === newContent)
    },
    10_000,
    "Message not found",
  )

  root.destroy()

  await waitForWithTimeout(
    async () => {
      await setTimeout(1000)
      const messages = await channel.messages.fetch()
      return messages
        .filter((m) => !m.deleted)
        .every((m) => m.content !== content)
    },
    10_000,
    "Message was not deleted",
  )

  t.pass()
})

test.serial("rapid updates", async (t) => {
  const content = nanoid()
  const newContent = nanoid()

  const root = render(content, channel)
  root.rerender(newContent)

  await waitForWithTimeout(
    async () => {
      const messages = await channel.messages.fetch()
      return messages.some((m) => m.content === newContent)
    },
    10_000,
    "Message not found",
  )

  root.rerender(content)
  root.destroy()

  await waitForWithTimeout(
    async () => {
      const messages = await channel.messages.fetch()
      return messages
        .filter((m) => !m.deleted)
        .every((m) => m.content !== content)
    },
    10_000,
    "Message was not deleted",
  )

  t.pass()
})
