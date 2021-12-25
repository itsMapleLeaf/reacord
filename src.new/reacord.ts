import type { Client, CommandInteraction } from "discord.js"
import type { ReactNode } from "react"
import { reconciler } from "./reconciler.js"
import { Renderer } from "./renderer.js"

export type ReacordConfig = {
  /**
   * A Discord.js client. Reacord will listen to interaction events
   * and send them to active instances. */
  client: Client

  /**
   * The max number of active instances.
   * When this limit is exceeded, the oldest instances will be disabled.
   */
  maxInstances?: number
}

export type ReacordInstance = {
  render: (content: ReactNode) => void
  deactivate: () => void
}

export class Reacord {
  private renderers: Renderer[] = []

  private constructor(private readonly config: ReacordConfig) {}

  private get maxInstances() {
    return this.config.maxInstances ?? 50
  }

  static create(config: ReacordConfig) {
    const manager = new Reacord(config)

    config.client.on("interactionCreate", (interaction) => {
      if (!interaction.isMessageComponent()) return
      for (const renderer of manager.renderers) {
        if (renderer.handleInteraction(interaction)) return
      }
    })

    return manager
  }

  reply(interaction: CommandInteraction): ReacordInstance {
    if (this.renderers.length > this.maxInstances) {
      this.deactivate(this.renderers[0]!)
    }

    const renderer = new Renderer(interaction)
    this.renderers.push(renderer)

    const container = reconciler.createContainer(renderer, 0, false, {})

    return {
      render: (content: ReactNode) => {
        reconciler.updateContainer(content, container)
      },
      deactivate: () => {
        this.deactivate(renderer)
      },
    }
  }

  private deactivate(renderer: Renderer) {
    this.renderers = this.renderers.filter((it) => it !== renderer)
    renderer.deactivate()
  }
}
