import { Client } from "discord.js"
import "dotenv/config"
import { InstanceManager } from "../src.new/main.js"
import { createCommandHandler } from "./command-handler.js"

const client = new Client({
  intents: ["GUILDS"],
})

const manager = new InstanceManager()

createCommandHandler(client, [
  {
    name: "counter",
    description: "shows a counter button",
    run: (interaction) => {
      manager.create(interaction).render("hi world")
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
