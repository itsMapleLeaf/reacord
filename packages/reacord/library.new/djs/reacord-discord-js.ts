import type { Client, Interaction } from "discord.js"
import type { ReactNode } from "react"
import type { ReacordOptions } from "../core/reacord-instance-pool"
import { ReacordInstancePool } from "../core/reacord-instance-pool"
import { ChannelMessageRenderer } from "./channel-message-renderer"

export class ReacordDiscordJs {
  private instances

  constructor(private readonly client: Client, options: ReacordOptions = {}) {
    this.instances = new ReacordInstancePool(options)
  }

  send(channelId: string, initialContent?: ReactNode) {
    const renderer = new ChannelMessageRenderer(this.client, channelId)
    return this.instances.create({ initialContent, renderer })
  }

  reply(interaction: Interaction, initialContent?: ReactNode) {}

  ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {}
}
