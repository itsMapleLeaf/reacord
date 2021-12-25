import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { InstanceManager } from "../src.new/main.js"
import { createCommandHandler } from "./command-handler.js"
import { Counter } from "./counter.js"

const client = new Client({
  intents: ["GUILDS"],
})

const manager = new InstanceManager()

createCommandHandler(client, [
  {
    name: "counter",
    description: "shows a counter button",
    run: (interaction) => {
      manager.create(interaction).render(<Counter />)
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
