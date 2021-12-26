import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { DiscordJsAdapter } from "../src/discord-js-adapter"
import { Reacord } from "../src/main.js"
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
