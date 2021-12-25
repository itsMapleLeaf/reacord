import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { Reacord } from "../src.new/main.js"
import { createCommandHandler } from "./command-handler.js"
import { Counter } from "./counter.js"

const client = new Client({
  intents: ["GUILDS"],
})

const reacord = Reacord.create({ client, maxInstances: 2 })

createCommandHandler(client, [
  {
    name: "counter",
    description: "shows a counter button",
    run: (interaction) => {
      const reply = reacord.reply(interaction)
      reply.render(<Counter onDeactivate={() => reply.deactivate()} />)
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
