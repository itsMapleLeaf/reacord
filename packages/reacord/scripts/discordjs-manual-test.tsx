import type { TextChannel } from "discord.js"
import { ChannelType, Client, IntentsBitField } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import prettyMilliseconds from "pretty-ms"
import React, { useEffect, useState } from "react"
import { raise } from "../helpers/raise"
import { waitFor } from "../helpers/wait-for"
import { ReacordDiscordJs } from "../library.new/main"

const client = new Client({ intents: IntentsBitField.Flags.Guilds })
const reacord = new ReacordDiscordJs(client)

await client.login(process.env.TEST_BOT_TOKEN)

const guild = await client.guilds.fetch(process.env.TEST_GUILD_ID!)

const category = await guild.channels.fetch(process.env.TEST_CATEGORY_ID!)
if (category?.type !== ChannelType.GuildCategory) {
  throw new Error(
    `channel ${process.env.TEST_CATEGORY_ID} is not a guild category. received ${category?.type}`,
  )
}

for (const [, channel] of category.children.cache) {
  await channel.delete()
}

let prefix = 0
const createTest = async (
  name: string,
  description: string,
  block: (channel: TextChannel) => void | Promise<unknown>,
) => {
  prefix += 1
  const channel = await category.children.create({
    type: ChannelType.GuildText,
    name: `${String(prefix).padStart(3, "0")}-${kebabCase(name)}`,
  })
  await channel.edit({ topic: description })
  await block(channel)
}

await createTest("basic", "should update over time", (channel) => {
  function Timer() {
    const [startDate] = useState(() => new Date())
    const [currentDate, setCurrentDate] = useState(startDate)

    useEffect(() => {
      const id = setInterval(() => {
        setCurrentDate(new Date())
      }, 3000)
      return () => clearInterval(id)
    }, [])

    return (
      <>
        this component has been running for{" "}
        {prettyMilliseconds(currentDate.valueOf() - startDate.valueOf(), {
          verbose: true,
        })}
      </>
    )
  }

  reacord.send(channel.id, <Timer />)
})

await createTest(
  "immediate renders",
  `should process renders in sequence; this should show "hi moon"`,
  async (channel) => {
    const instance = reacord.send(channel.id)
    instance.render("hi world")
    instance.render("hi moon")
  },
)

await createTest(
  "destroy",
  "should remove the message; this channel should be empty",
  async (channel) => {
    const instance = reacord.send(channel.id)
    instance.render("hi world")
    instance.render("hi moon")
    await waitFor(async () => {
      const messages = await channel.messages.fetch({ limit: 1 })
      if (messages.first()?.content !== "hi moon") {
        raise("not ready")
      }
    })
    instance.destroy()
  },
)

await createTest(
  "immediate destroy",
  "should never show if called immediately; this channel should be empty",
  async (channel) => {
    const instance = reacord.send(channel.id)
    instance.render("hi world")
    instance.render("hi moon")
    instance.destroy()
  },
)
