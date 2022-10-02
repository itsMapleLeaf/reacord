import { raise } from "@reacord/helpers/raise"
import { Client, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { oraPromise } from "ora"
import React from "react"
import { Button, ReacordClient } from "../../reacord/src/main"

dotenv.config({
  path: join(fileURLToPath(import.meta.url), "../../../../.env"),
  override: true,
})

const token = process.env.TEST_BOT_TOKEN ?? raise("TEST_BOT_TOKEN not defined")

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const reacord = new ReacordClient({ token })

client.once("ready", async (client) => {
  try {
    await oraPromise(
      client.application.commands.create({
        name: "counter",
        description: "counts things",
      }),
      "Registering commands",
    )
  } catch (error) {
    console.error("Failed to register commands:", error)
  }
})

client.on("interactionCreate", async (interaction) => {
  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === "counter"
  ) {
    reacord.reply(interaction, <Counter />)
    // reacord.reply(interaction, "test3").render("test4")
  }
})

await oraPromise(client.login(token), "Logging in")

function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      count: {count}
      <Button label="+" onClick={() => setCount(count + 1)} />
    </>
  )
}
