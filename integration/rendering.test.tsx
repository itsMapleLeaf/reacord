/* eslint-disable unicorn/no-null */
import type { ButtonInteraction, Message, MessageOptions } from "discord.js"
import { Client, TextChannel } from "discord.js"
import { nanoid } from "nanoid"
import React, { useState } from "react"
import { omit } from "../src/helpers/omit.js"
import { raise } from "../src/helpers/raise.js"
import { waitForWithTimeout } from "../src/helpers/wait-for-with-timeout.js"
import type { ReacordRoot } from "../src/main.js"
import {
  ActionRow,
  Button,
  createRoot,
  Embed,
  EmbedField,
  Text,
} from "../src/main.js"
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
  await assertMessages([{ embeds: [{ author: { name: "only author" } }] }])
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
      <Button onClick={() => {}} style="primary">
        primary button
      </Button>
      <Button onClick={() => {}} style="danger">
        danger button
      </Button>
      <Button onClick={() => {}} style="success">
        success button
      </Button>
      <Button onClick={() => {}} style="secondary">
        secondary button
      </Button>
      <Button onClick={() => {}}>secondary by default</Button>
      <Button onClick={() => {}}>
        complex <Text>button</Text> text
      </Button>
      <Button onClick={() => {}} disabled>
        disabled button
      </Button>
      <ActionRow>
        <Button onClick={() => {}}>new action row</Button>
      </ActionRow>
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
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              label: "primary button",
              style: "PRIMARY",
              disabled: false,
            },
            {
              type: "BUTTON",
              label: "danger button",
              style: "DANGER",
              disabled: false,
            },
            {
              type: "BUTTON",
              label: "success button",
              style: "SUCCESS",
              disabled: false,
            },
            {
              type: "BUTTON",
              label: "secondary button",
              style: "SECONDARY",
              disabled: false,
            },
            {
              type: "BUTTON",
              label: "secondary by default",
              style: "SECONDARY",
              disabled: false,
            },
          ],
        },
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              label: "complex button text",
              style: "SECONDARY",
              disabled: false,
            },
            {
              type: "BUTTON",
              label: "disabled button",
              style: "SECONDARY",
              disabled: true,
            },
          ],
        },
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              label: "new action row",
              style: "SECONDARY",
              disabled: false,
            },
          ],
        },
      ],
    },
  ])
})

test("button onClick", async () => {
  let clicked = false
  await root.render(<Button onClick={() => (clicked = true)} />)
  await clickButton()
  await waitForWithTimeout(() => clicked, 1000)
})

test("button click with state", async () => {
  function Counter() {
    const [count, setCount] = useState(0)
    return <Button onClick={() => setCount(count + 1)}>{count}</Button>
  }

  async function assertCount(count: number) {
    await assertMessages([
      {
        content: "_ _",
        components: [
          {
            type: "ACTION_ROW",
            components: [
              {
                type: "BUTTON",
                style: "SECONDARY",
                label: String(count),
                disabled: false,
              },
            ],
          },
        ],
      },
    ])
  }

  await root.render(<Counter />)
  await assertCount(0)
  await clickButton()
  await assertCount(1)
  await clickButton()
  await assertCount(2)
}, 10_000)

test("destroy", async () => {
  await root.destroy()
  await assertMessages([])
})

async function assertMessages(expected: MessageOptions[]) {
  const messages = await channel.messages.fetch()

  expect(messages.map((message) => extractMessageData(message))).toEqual(
    expected,
  )

  return messages
}

async function clickButton(index = 0) {
  const messages = await channel.messages.fetch()

  const components = [...messages.values()]
    .flatMap((message) => message.components.flatMap((row) => row.components))
    .flatMap((component) => (component.type === "BUTTON" ? [component] : []))

  const customId =
    components[index]?.customId ?? raise(`Button not found at index ${index}`)

  global.setTimeout(() => {
    channel.client.emit("interactionCreate", createButtonInteraction(customId))
  })
  await channel.awaitMessageComponent({
    filter: (interaction) => interaction.customId === customId,
    time: 1000,
  })
  await root.complete()
}

function createButtonInteraction(customId: string) {
  return {
    id: nanoid(),
    type: "MESSAGE_COMPONENT",
    componentType: "BUTTON",
    channelId: channel.id,
    guildId: channel.guildId,
    isButton: () => true,
    customId,
    user: { id: "123" },
    deferUpdate: () => Promise.resolve(),
  } as ButtonInteraction
}

function extractMessageData(message: Message): MessageOptions {
  return pruneUndefinedValues({
    content: nonEmptyOrUndefined(message.content),
    embeds: nonEmptyOrUndefined(
      pruneUndefinedValues(
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
    components: nonEmptyOrUndefined(
      message.components.map((row) => ({
        type: "ACTION_ROW",
        components: row.components.map((component) => {
          if (component.type === "BUTTON") {
            return pruneUndefinedValues({
              type: "BUTTON",
              style: component.style ?? "SECONDARY",
              label: component.label ?? undefined,
              emoji: component.emoji?.name,
              url: component.url ?? undefined,
              disabled: component.disabled ?? undefined,
            })
          }

          if (component.type === "SELECT_MENU") {
            return pruneUndefinedValues({
              type: "SELECT_MENU",
              disabled: component.disabled ?? undefined,
              options: component.options.map((option) => ({
                label: option.label ?? undefined,
                value: option.value ?? undefined,
              })),
            })
          }

          raise(`unknown component type ${(component as any).type}`)
        }),
      })),
    ),
  })
}

function pruneUndefinedValues<T>(input: T) {
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
