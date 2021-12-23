import type { CommandInteraction } from "discord.js"
import { Client } from "discord.js"
import "dotenv/config"
import * as React from "react"
import { createRoot } from "../src/main.js"
import { Counter } from "./counter.js"

const client = new Client({
  intents: ["GUILDS"],
})

type Command = {
  name: string
  description: string
  run: (interaction: CommandInteraction) => unknown
}

const commands: Command[] = [
  {
    name: "counter",
    description: "shows a counter button",
    run: async (interaction) => {
      await interaction.reply("a")
      await createRoot(interaction.channel!).render(<Counter />)
    },
  },
]

client.on("ready", async () => {
  for (const command of commands) {
    for (const guild of client.guilds.cache.values()) {
      await client.application?.commands.create(
        {
          name: command.name,
          description: command.description,
        },
        guild.id,
      )
    }
  }
  console.info("ready 💖")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const command = commands.find(
    (command) => command.name === interaction.commandName,
  )
  if (command) {
    try {
      await command.run(interaction)
    } catch (error) {
      console.error(error)
    }
  }
})

await client.login(process.env.TEST_BOT_TOKEN)
