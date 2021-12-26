import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { DiscordJsAdapter, Reacord } from "../library/main.js"
import { createCommandHandler } from "./command-handler.js"
import { Counter } from "./counter.js"

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
      const reply = reacord.createCommandReply(interaction)
      reply.render(<Counter onDeactivate={() => reply.deactivate()} />)
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
