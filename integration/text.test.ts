import test from "ava"
import { Client, TextChannel } from "discord.js"
import { nanoid } from "nanoid"
import { raise } from "../src/helpers/raise.js"
import { createRoot } from "../src/render.js"
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

test("rendering text", async (t) => {
  const root = createRoot(channel)

  const content = nanoid()
  await root.render(content)

  {
    const messages = await channel.messages.fetch()
    t.true(messages.some((m) => m.content === content))
  }

  const newContent = nanoid()
  await root.render(newContent)

  {
    const messages = await channel.messages.fetch()
    t.true(messages.some((m) => m.content === newContent))
  }

  await root.render(false)

  {
    const messages = await channel.messages.fetch()
    t.false(messages.some((m) => m.content === newContent))
  }
})

test("rapid updates", async (t) => {
  const root = createRoot(channel)

  const content = nanoid()
  const newContent = nanoid()

  void root.render(content)
  await root.render(newContent)

  {
    const messages = await channel.messages.fetch()
    t.true(messages.some((m) => m.content === newContent))
  }

  void root.render(content)
  await root.render(false)

  {
    const messages = await channel.messages.fetch()
    t.false(messages.some((m) => m.content === newContent))
  }
})
