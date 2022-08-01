import type {
  APIMessageComponentButtonInteraction,
  Client,
  Message,
  TextChannel,
} from "discord.js"
import type { ReactNode } from "react"
import type { HostElement } from "../core/host-element.js"
import { makeMessageUpdatePayload } from "../core/make-message-update-payload.js"
import type { ReacordRenderer } from "../core/reacord-instance.js"
import { ReacordInstance } from "../core/reacord-instance.js"

export class ReacordDiscordJs {
  instances: ReacordInstance[] = []

  constructor(private readonly client: Client) {
    client.on("interactionCreate", (interaction) => {
      if (!interaction.inGuild()) return

      if (interaction.isButton()) {
        const json =
          interaction.toJSON() as APIMessageComponentButtonInteraction

        for (const instance of this.instances) {
          instance.handleButtonInteraction(interaction.customId, {
            interaction: json,
            reply: () => {},
            ephemeralReply: () => {},
          })
        }
      }

      if (interaction.isSelectMenu()) {
        // etc.
      }
    })
  }

  send(channelId: string, initialContent?: ReactNode) {
    const instance = new ReacordInstance(
      new ChannelMessageRenderer(this.client, channelId),
    )
    if (initialContent !== undefined) {
      instance.render(initialContent)
    }
  }
}

class ChannelMessageRenderer implements ReacordRenderer {
  private message?: Message

  constructor(
    private readonly client: Client,
    private readonly channelId: string,
  ) {}

  async updateMessage(tree: HostElement) {
    const payload = makeMessageUpdatePayload(tree)

    if (!this.message) {
      const channel = (await this.client.channels.fetch(
        this.channelId,
      )) as TextChannel
      this.message = await channel.send(payload)
    } else {
      await this.message.edit(payload)
    }
  }
}
