/* eslint-disable unicorn/no-null */
import type { Message } from "discord.js"
import { Client, TextChannel } from "discord.js"
import { deepEqual } from "node:assert"
import type { ReacordRoot } from "reacord"
import { createRoot, Embed, Text } from "reacord"
import { pick } from "reacord-helpers/pick.js"
import { raise } from "reacord-helpers/raise.js"
import React from "react"
import { afterAll, beforeAll, test } from "vitest"
import { testBotToken, testChannelId } from "./test-environment.js"

const client = new Client({
  intents: ["GUILDS"],
})

let channel: TextChannel
let root: ReacordRoot

beforeAll(async () => {
  await client.login(testBotToken)

  const result =
    client.channels.cache.get(testChannelId) ??
    (await client.channels.fetch(testChannelId)) ??
    raise("Channel not found")

  if (!(result instanceof TextChannel)) {
    throw new TypeError("Channel must be a text channel")
  }

  channel = result

  for (const [, message] of await channel.messages.fetch()) {
    await message.delete()
  }

  root = createRoot(channel)
})

afterAll(() => {
  client.destroy()
})

test("rapid updates", async () => {
  // rapid updates
  void root.render("hi world")
  void root.render("hi the")
  await root.render("hi moon")
  await assertMessages([{ content: "hi moon" }])
})

test("nested text", async () => {
  await root.render(
    <Text>
      <Text>hi world</Text>{" "}
      <Text>
        hi moon <Text>hi sun</Text>
      </Text>
    </Text>,
  )
  await assertMessages([{ content: "hi world hi moon hi sun" }])
})

test.only("empty embed fallback", async () => {
  await root.render(<Embed />)
  await assertMessages([{ embeds: [{ description: "_ _" }] }])
})

test.only("embed with only author", async () => {
  await root.render(<Embed author={{ name: "only author" }} />)
  await assertMessages([
    { embeds: [{ description: "_ _", author: { name: "only author" } }] },
  ])
})

test("empty embed author", async () => {
  await root.render(<Embed author={{}} />)
  await assertMessages([{ embeds: [{ description: "_ _" }] }])
})

test("kitchen sink", async () => {
  await root.render(
    <>
      message <Text>content</Text>
      no space
      <Embed
        color="#feeeef"
        title="the embed"
        url="https://example.com"
        timestamp={new Date().toISOString()}
        thumbnailUrl="https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024"
        author={{
          name: "hi craw",
          url: "https://example.com",
          iconUrl:
            "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024",
        }}
        footer={{
          text: "the footer",
          iconUrl:
            "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024",
        }}
      >
        description <Text>more description</Text>
      </Embed>
      <Embed>
        another <Text>hi</Text>
      </Embed>
    </>,
  )
  await assertMessages([
    {
      content: "message contentno space",
      embeds: [
        {
          color: 0xfe_ee_ef,
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

test("destroy", async () => {
  await root.destroy()
  await assertMessages([])
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

async function assertMessages(expected: Array<DeepPartial<MessageData>>) {
  const messages = await channel.messages.fetch()

  deepEqual(
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
