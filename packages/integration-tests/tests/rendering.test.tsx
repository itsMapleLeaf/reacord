/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/no-null */
import type { ExecutionContext } from "ava"
import test from "ava"
import type { Message } from "discord.js"
import { Client, TextChannel } from "discord.js"
import type { ReacordRoot } from "reacord"
import { createRoot, Embed, EmbedAuthor, Text } from "reacord"
import { pick } from "reacord-helpers/pick.js"
import { raise } from "reacord-helpers/raise.js"
import React from "react"
import { testBotToken, testChannelId } from "./test-environment.js"

const client = new Client({
  intents: ["GUILDS"],
})

let channel: TextChannel
let root: ReacordRoot

test.serial.before(async () => {
  await client.login(testBotToken)

  const result =
    client.channels.cache.get(testChannelId) ??
    (await client.channels.fetch(testChannelId)) ??
    raise("Channel not found")

  if (!(result instanceof TextChannel)) {
    throw new TypeError("Channel must be a text channel")
  }

  channel = result
  root = createRoot(channel)

  for (const [, message] of await channel.messages.fetch()) {
    await message.delete()
  }
})

test.after(() => {
  client.destroy()
})

// test.serial.beforeEach(async () => {
//   const messages = await channel.messages.fetch()
//   await Promise.all(messages.map((message) => message.delete()))
// })

test.serial("rapid updates", async (t) => {
  // rapid updates
  void root.render("hi world")
  void root.render("hi the")
  await root.render("hi moon")
  await assertMessages(t, [{ content: "hi moon" }])
})

test.serial("nested text", async (t) => {
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
  await root.render(<Embed />)
  await assertMessages(t, [{ embeds: [{ description: "_ _" }] }])
})

test.serial("embed with only author", async (t) => {
  await root.render(
    <Embed>
      <EmbedAuthor>only author</EmbedAuthor>
    </Embed>,
  )
  await assertMessages(t, [
    { embeds: [{ description: "_ _", author: { name: "only author" } }] },
  ])
})

test.serial("empty embed author", async (t) => {
  await root.render(
    <Embed>
      <EmbedAuthor />
    </Embed>,
  )
  await assertMessages(t, [{ embeds: [{ description: "_ _" }] }])
})

test.serial("kitchen sink", async (t) => {
  await root.render(
    <>
      message <Text>content</Text>
      no space
      <Embed color="#feeeef">
        description <Text>more description</Text>
        <EmbedAuthor
          url="https://example.com"
          iconUrl="https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024"
        >
          hi craw
        </EmbedAuthor>
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
          author: {
            name: "hi craw",
            url: "https://example.com",
            iconURL:
              "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024",
          },
        },
        { author: {}, color: null, description: "another hi" },
      ],
    },
  ])
})

test.serial("destroy", async (t) => {
  await root.destroy()
  await assertMessages(t, [])
})

type MessageData = ReturnType<typeof extractMessageData>
function extractMessageData(message: Message) {
  return {
    content: message.content,
    embeds: message.embeds.map((embed) => ({
      ...pick(embed, "color", "description"),
      author: embed.author
        ? pick(embed.author, "name", "url", "iconURL")
        : { name: "" },
    })),
  }
}

async function assertMessages(
  t: ExecutionContext<unknown>,
  expected: Array<DeepPartial<MessageData>>,
) {
  const messages = await channel.messages.fetch()

  t.deepEqual(
    messages.map((message) => extractMessageData(message)),
    expected.map((message) => ({
      content: "",
      ...message,
      embeds:
        message.embeds?.map((embed) => ({
          color: null,
          description: "",
          ...embed,
          author: {
            name: "",
            ...embed?.author,
          },
        })) ?? [],
    })),
  )
}

type DeepPartial<Subject> = Subject extends object
  ? {
      [Key in keyof Subject]?: DeepPartial<Subject[Key]>
    }
  : Subject
