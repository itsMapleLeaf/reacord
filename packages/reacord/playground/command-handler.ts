import type { Client, CommandInteraction } from "discord.js"

type Command = {
  name: string
  description: string
  run: (interaction: CommandInteraction) => unknown
}

export function createCommandHandler(client: Client, commands: Command[]) {
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
}
