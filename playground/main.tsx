import { Client } from "discord.js"
import "dotenv/config"
import React from "react"
import { Button, ReacordDiscordJs } from "../library/main"
import { createCommandHandler } from "./command-handler"
import { Counter } from "./counter"
import { FruitSelect } from "./fruit-select"

const client = new Client({
  intents: ["GUILDS"],
})

const reacord = new ReacordDiscordJs(client)

client.on("ready", () => {
  console.info("ready 💖")

  // const now = new Date()

  // function UptimeCounter() {
  //   const [uptime, setUptime] = React.useState(0)

  //   React.useEffect(() => {
  //     const interval = setInterval(() => {
  //       setUptime(Date.now() - now.getTime())
  //     }, 5000)
  //     return () => clearInterval(interval)
  //   }, [])

  //   return (
  //     <Embed>this bot has been running for {prettyMilliseconds(uptime)}</Embed>
  //   )
  // }

  // reacord.send("671787605624487941", <UptimeCounter />)
})

createCommandHandler(client, [
  {
    name: "button",
    description: "it's a button",
    run: (interaction) => {
      reacord.reply(
        interaction,
        <Button label="clic" onClick={() => console.info("was clic")} />,
      )
    },
  },
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
      reacord.reply(interaction, <FruitSelect />)
    },
  },
])

await client.login(process.env.TEST_BOT_TOKEN)
