import test from "ava"
import { Client, TextChannel } from "discord.js"
import { nanoid } from "nanoid"
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

test("rendering text", async (t) => {
  const content = nanoid()
  const root = render(content, channel)

  await waitForWithTimeout(async () => {
    const messages = await channel.messages.fetch()
    return messages.some((m) => m.content === content)
  }, 4000)

  const newContent = nanoid()
  root.rerender(newContent)

  await waitForWithTimeout(async () => {
    const messages = await channel.messages.fetch({ limit: 1 })
    return messages.some((m) => m.content === content)
  }, 4000)

  root.destroy()

  await waitForWithTimeout(async () => {
    const messages = await channel.messages.fetch({ limit: 1 })
    return messages
      .filter((m) => !m.deleted)
      .every((m) => m.content !== content)
  }, 4000)

  t.pass()
})
