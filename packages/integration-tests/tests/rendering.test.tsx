/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/no-null */
import type { ExecutionContext } from "ava"
import test from "ava"
import type { Message } from "discord.js"
import { Client, TextChannel } from "discord.js"
import { createRoot, Embed, Text } from "reacord"
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

test.serial("kitchen sink + destroy", async (t) => {
  const root = createRoot(channel)

  await root.render(
    <>
      message <Text>content</Text>
      no space
      <Embed color="#feeeef">
        description <Text>more description</Text>
      </Embed>
      <Embed>
        another <Text>hi</Text>
      </Embed>
    </>,
  )
  await assertMessages(t, [
    {
      content: "message contentno space",
      embeds: [
        {
          color: 0xfeeeef,
          description: "description more description",
        },
        { color: null, description: "another hi" },
      ],
    },
  ])

  await root.destroy()
  await assertMessages(t, [])
})

test.serial("updates", async (t) => {
  const root = createRoot(channel)

  // rapid updates
  void root.render("hi world")
  await root.render("hi moon")
  await assertMessages(t, [{ content: "hi moon" }])

  // regular update after initial render
  await root.render(<Text>hi sun</Text>)
  await assertMessages(t, [{ content: "hi sun" }])

  // update that requires cloning a node
  await root.render(<Text>the</Text>)
  await assertMessages(t, [{ content: "the" }])
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

test.serial("empty embed fallback", async (t) => {
  const root = createRoot(channel)

  await root.render(<Embed />)
  await assertMessages(t, [{ embeds: [{ color: null, description: "_ _" }] }])
})

type MessageData = ReturnType<typeof extractMessageData>
function extractMessageData(message: Message) {
  return {
    content: message.content,
    embeds: message.embeds.map((embed) => pick(embed, "color", "description")),
  }
}

async function assertMessages(
  t: ExecutionContext<unknown>,
  expected: Array<Partial<MessageData>>,
) {
  const messages = await channel.messages.fetch()

  const messageDataFallback: MessageData = {
    content: "",
    embeds: [],
  }

  t.deepEqual(
    messages.map((message) => extractMessageData(message)),
    expected.map((data) => ({ ...messageDataFallback, ...data })),
  )
}
