import type { TextChannel } from "discord.js"
import { ChannelType, Client, IntentsBitField } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import React, { useEffect, useState } from "react"
import { createReacordDiscordJs } from "../library.new/discord-js"

const client = new Client({ intents: IntentsBitField.Flags.Guilds })
const reacord = createReacordDiscordJs(client)

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
  block: (channel: TextChannel) => void | Promise<unknown>,
) => {
  prefix += 1
  const channel = await category.children.create({
    type: ChannelType.GuildText,
    name: `${String(prefix).padStart(3, "0")}-${kebabCase(name)}`,
  })
  await block(channel)
}

await createTest("basic", (channel) => {
  function Timer() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const id = setInterval(() => {
        setCount((count) => count + 3)
      }, 3000)
      return () => clearInterval(id)
    }, [])

    return <>this component has been running for {count} seconds</>
  }

  reacord.send(channel.id, <Timer />)
})

await createTest("immediate renders", async (channel) => {
  const instance = reacord.send(channel.id)
  instance.render("hi world")
  instance.render("hi moon")
})
