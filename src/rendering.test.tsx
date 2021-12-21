/* eslint-disable unicorn/no-null */
import type { Message, MessageOptions } from "discord.js"
import { Client, TextChannel } from "discord.js"
import React from "react"
import { EmbedField } from "./embed-field.js"
import { omit } from "./helpers/omit.js"
import { raise } from "./helpers/raise.js"
import type { ReacordRoot } from "./main"
import { createRoot, Embed, Text } from "./main"
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

test("empty embed fallback", async () => {
  await root.render(<Embed />)
  await assertMessages([{ embeds: [{ description: "_ _" }] }])
})

test("embed with only author", async () => {
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
  const timestamp = Date.now()
  const image =
    "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024"

  await root.render(
    <>
      message <Text>content</Text>
      no space
      <Embed
        color="#feeeef"
        title="the embed"
        url="https://example.com"
        timestamp={timestamp}
        imageUrl={image}
        thumbnailUrl={image}
        author={{
          name: "hi craw",
          url: "https://example.com",
          iconUrl: image,
        }}
        footer={{
          text: "the footer",
          iconUrl: image,
        }}
      >
        description <Text>more description</Text>
      </Embed>
      <Embed>
        another <Text>hi</Text>
        <EmbedField name="field name">field content</EmbedField>
        <EmbedField name="field name" inline>
          field content but inline
        </EmbedField>
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
          image: { url: image },
          thumbnail: { url: image },
          author: {
            name: "hi craw",
            url: "https://example.com",
            iconURL:
              "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024",
          },
          footer: {
            text: "the footer",
            iconURL:
              "https://cdn.discordapp.com/avatars/109677308410875904/3e53fcb70760a08fa63f73376ede5d1f.png?size=1024",
          },
          timestamp,
          title: "the embed",
          url: "https://example.com",
        },
        {
          description: "another hi",
          fields: [
            { name: "field name", value: "field content", inline: false },
            {
              name: "field name",
              value: "field content but inline",
              inline: true,
            },
          ],
        },
      ],
    },
  ])
})

test("destroy", async () => {
  await root.destroy()
  await assertMessages([])
})

async function assertMessages(expected: MessageOptions[]) {
  const messages = await channel.messages.fetch()

  expect(messages.map((message) => extractMessageData(message))).toEqual(
    expected,
  )
}

function extractMessageData(message: Message): MessageOptions {
  return {
    content: nonEmptyOrUndefined(message.content),
    embeds: nonEmptyOrUndefined(
      pruneUndefinedKeys(
        message.embeds.map((embed) => ({
          title: embed.title ?? undefined,
          description: embed.description ?? undefined,
          url: embed.url ?? undefined,
          timestamp: embed.timestamp ?? undefined,
          color: embed.color ?? undefined,
          fields: nonEmptyOrUndefined(embed.fields),
          author: embed.author ? omit(embed.author, "proxyIconURL") : undefined,
          thumbnail: embed.thumbnail
            ? omit(embed.thumbnail, "proxyURL", "width", "height")
            : undefined,
          image: embed.image
            ? omit(embed.image, "proxyURL", "width", "height")
            : undefined,
          video: embed.video ?? undefined,
          footer: embed.footer ? omit(embed.footer, "proxyIconURL") : undefined,
        })),
      ),
    ),
  }
}

function pruneUndefinedKeys<T>(input: T) {
  return JSON.parse(JSON.stringify(input))
}

function nonEmptyOrUndefined<T extends unknown>(input: T): T | undefined {
  if (
    input == undefined ||
    input === "" ||
    (Array.isArray(input) && input.length === 0)
  ) {
    return undefined
  }
  return input
}
