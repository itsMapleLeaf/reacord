import type { ExecutionContext } from "ava"
import test from "ava"
import { Client, TextChannel } from "discord.js"
import { nanoid } from "nanoid"
import { createRoot, Embed } from "reacord"
import { raise } from "reacord-helpers/raise.js"
import React, { useState } from "react"
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

test.only("test", async (t) => {
  const root = createRoot(channel)
  await root.render(
    <>
      <Embed color="BLUE">
        <Embed color="DARKER_GREY" />
      </Embed>
      <Embed color="DARKER_GREY" />
    </>,
  )
  t.pass()
})

test("kitchen sink", async (t) => {
  const root = createRoot(channel)

  const content = nanoid()
  await root.render(content)

  await assertSomeMessageHasContent(t, content)

  const newContent = nanoid()
  await root.render(newContent)

  await assertSomeMessageHasContent(t, newContent)

  await root.render(false)

  await assertNoMessageHasContent(t, newContent)
})

test("kitchen sink, rapid updates", async (t) => {
  const root = createRoot(channel)

  const content = nanoid()
  const newContent = nanoid()

  void root.render(content)
  await root.render(newContent)

  await assertSomeMessageHasContent(t, newContent)

  void root.render(content)
  await root.render(false)

  await assertNoMessageHasContent(t, newContent)
})

test("state", async (t) => {
  let setMessage: (message: string) => void

  const initialMessage = nanoid()
  const newMessage = nanoid()

  function Counter() {
    const [message, setMessage_] = useState(initialMessage)
    setMessage = setMessage_
    return `state: ${message}` as any
  }

  const root = createRoot(channel)
  await root.render(<Counter />)

  await assertSomeMessageHasContent(t, initialMessage)

  setMessage!(newMessage)
  await root.completion()

  await assertSomeMessageHasContent(t, newMessage)

  await root.destroy()
})

async function assertSomeMessageHasContent(
  t: ExecutionContext,
  content: string,
) {
  const messages = await channel.messages.fetch()
  t.true(messages.some((m) => m.content.includes(content)))
}

async function assertNoMessageHasContent(t: ExecutionContext, content: string) {
  const messages = await channel.messages.fetch()
  t.true(messages.every((m) => !m.content.includes(content)))
}
