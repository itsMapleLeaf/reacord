import { raise } from "@reacord/helpers/raise.js"
import { waitFor } from "@reacord/helpers/wait-for.js"
import { ChannelType, Client, IntentsBitField, TextChannel } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import prettyMilliseconds from "pretty-ms"
import React, { useEffect, useState } from "react"
import { Button, ReacordDiscordJs } from "../library.new/main"

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

let index = 0
const createTest = async (
  name: string,
  description: string,
  block: (channel: TextChannel) => void | Promise<unknown>,
) => {
  const channelName = `${String(index).padStart(3, "0")}-${kebabCase(name)}`

  let channel = category.children.cache.find((ch) => ch.name === channelName)
  if (channel instanceof TextChannel) {
    for (const [, msg] of await channel.messages.fetch()) {
      await msg.delete()
    }
  } else {
    await channel?.delete()
    channel = await category.children.create({
      type: ChannelType.GuildText,
      name: channelName,
      topic: description,
      position: index,
    })
  }

  await block(channel)
  index += 1
}

await createTest(
  "buttons",
  "should show button text, emojis, and make automatic action rows",
  async (channel) => {
    reacord.send(
      channel.id,
      <>
        <Button label="strawberry" onClick={() => {}} />
        <Button emoji="🍓" onClick={() => {}} />
        <Button label="strawberry" emoji="🍓" onClick={() => {}} />
      </>,
    )
    reacord.send(
      channel.id,
      <>
        <Button label="primary" style="primary" onClick={() => {}} />
        <Button label="secondary" style="secondary" onClick={() => {}} />
        <Button label="success" style="success" onClick={() => {}} />
        <Button label="danger" style="danger" onClick={() => {}} />
      </>,
    )
    reacord.send(
      channel.id,
      <>
        <Button label="disabled" disabled onClick={() => {}} />
      </>,
    )
  },
)

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
