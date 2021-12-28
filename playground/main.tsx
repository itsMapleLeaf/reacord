import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { DiscordJsAdapter, Reacord } from "../library/main"
import { createCommandHandler } from "./command-handler"
import { Counter } from "./counter"
import { FruitSelect } from "./fruit-select"

const client = new Client({
  intents: ["GUILDS"],
})

const reacord = new Reacord({
  adapter: new DiscordJsAdapter(client),
  maxInstances: 2,
})

createCommandHandler(client, [
  {
    name: "counter",
    description: "shows a counter button",
    run: (interaction) => {
      const reply = reacord.reply(interaction)
      reply.render(<Counter onDeactivate={() => reply.destroy()} />)
    },
  },
  {
    name: "select",
    description: "shows a select",
    run: (interaction) => {
      reacord.reply(interaction).render(<FruitSelect />)
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
