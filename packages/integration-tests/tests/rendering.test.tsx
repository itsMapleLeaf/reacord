import type { ExecutionContext } from "ava"
import test from "ava"
import type { Message } from "discord.js"
import { Client, TextChannel } from "discord.js"
import { createRoot, Text } from "reacord"
import { pick } from "reacord-helpers/pick.js"
import { raise } from "reacord-helpers/raise.js"
import React from "react"
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

test.beforeEach(async () => {
  const messages = await channel.messages.fetch()
  await Promise.all(messages.map((message) => message.delete()))
})

test.serial("basic text & content updates", async (t) => {
  const root = createRoot(channel)

  await root.render("hi world")
  await assertMessages(t, [{ content: "hi world" }])

  await root.render(
    <>
      {"hi world"} {"hi moon"}
    </>,
  )
  await assertMessages(t, [{ content: "hi world hi moon" }])

  await root.render(<Text>hi world</Text>)
  await assertMessages(t, [{ content: "hi world" }])

  await root.render(<Text></Text>)
  await assertMessages(t, [{ content: "_ _" }])

  await root.render(<Text>hi world</Text>)
  await assertMessages(t, [{ content: "hi world" }])

  await root.render([])
  await assertMessages(t, [{ content: "_ _" }])

  await root.destroy()
  await assertMessages(t, [])
})

test.serial("nested text", async (t) => {
  const root = createRoot(channel)

  await root.render(
    <Text>
      <Text>hi world</Text>{" "}
      <Text>
        hi moon <Text>hi sun</Text>
      </Text>
    </Text>,
  )
  await assertMessages(t, [{ content: "hi world hi moon hi sun" }])
})

type MessageData = ReturnType<typeof extractMessageData>
function extractMessageData(message: Message) {
  return pick(message, "content", "embeds", "components")
}

async function assertMessages(
  t: ExecutionContext<unknown>,
  expected: Array<Partial<MessageData>>,
) {
  const messages = await channel.messages.fetch()

  const messageDataFallback: MessageData = {
    content: "",
    embeds: [],
    components: [],
  }

  t.deepEqual(
    messages.map((message) => extractMessageData(message)),
    expected.map((data) => ({ ...messageDataFallback, ...data })),
  )
}
