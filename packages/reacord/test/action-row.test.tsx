import { raise } from "@reacord/helpers/raise"
import type { TextBasedChannel } from "discord.js"
import {
  CategoryChannel,
  ChannelType,
  ComponentType,
  GatewayIntentBits,
} from "discord.js"
import React from "react"
import { beforeAll, expect, test } from "vitest"
import { createDiscordClient } from "../library/create-discord-client"
import {
  ActionRow,
  Button,
  Option,
  ReacordClient,
  Select,
} from "../library/main"
import { testEnv } from "./test-env"

let channel: TextBasedChannel
beforeAll(async () => {
  const client = await createDiscordClient(testEnv.TEST_BOT_TOKEN, {
    intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages,
  })

  const category =
    client.channels.cache.get(testEnv.TEST_CATEGORY_ID) ??
    (await client.channels.fetch(testEnv.TEST_CATEGORY_ID))

  if (!(category instanceof CategoryChannel)) {
    throw new TypeError("Category channel not found")
  }

  const channelName = "test-channel"

  let existing = category.children.cache.find((the) => the.name === channelName)
  if (!existing || !existing.isTextBased()) {
    existing = await category.children.create({
      type: ChannelType.GuildText,
      name: channelName,
    })
  }
  channel = existing

  for (const [, message] of await channel.messages.fetch()) {
    await message.delete()
  }
})

test("action row", async () => {
  const reacord = new ReacordClient({
    token: testEnv.TEST_BOT_TOKEN,
  })

  reacord.send(
    channel.id,
    <>
      <Button label="outside button" onClick={() => {}} />
      <ActionRow>
        <Button label="button inside action row" onClick={() => {}} />
      </ActionRow>
      <Select value="the">
        <Option value="the" />
      </Select>
      <Button label="last row 1" onClick={() => {}} />
      <Button label="last row 2" onClick={() => {}} />
    </>,
  )

  const message = await channel
    .awaitMessages({ max: 1 })
    .then((result) => result.first() ?? raise("message not found"))

  expect(message.components.map((c) => c.toJSON())).toEqual([
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "outside button",
        }),
      ],
    },
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "button inside action row",
        }),
      ],
    },
    {
      type: ComponentType.ActionRow,
      components: [expect.objectContaining({ type: ComponentType.SelectMenu })],
    },
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "last row 1",
        }),
        expect.objectContaining({
          type: ComponentType.Button,
          label: "last row 2",
        }),
      ],
    },
  ])
}, 15_000)
