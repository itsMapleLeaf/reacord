import type {
  Client,
  CommandInteraction,
  MessageComponentInteraction,
} from "discord.js"
import type { ReactNode } from "react"
import type { OpaqueRoot } from "react-reconciler"
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

export class Reacord {
  private instances: Instance[] = []

  private constructor(private readonly config: ReacordConfig) {}

  private get maxInstances() {
    return this.config.maxInstances ?? 50
  }

  static create(config: ReacordConfig) {
    const manager = new Reacord(config)

    config.client.on("interactionCreate", (interaction) => {
      if (!interaction.isMessageComponent()) return
      for (const instance of manager.instances) {
        if (instance.handleInteraction(interaction)) return
      }
    })

    return manager
  }

  reply(interaction: CommandInteraction) {
    const instance = new Instance(interaction)
    this.instances.push(instance)

    if (this.instances.length > this.maxInstances) {
      this.deactivate(this.instances[0]!)
    }

    return {
      render: (content: ReactNode) => instance.render(content),
      deactivate: () => this.deactivate(instance),
    }
  }

  private deactivate(instance: Instance) {
    this.instances = this.instances.filter((it) => it !== instance)
    instance.deactivate()
  }
}

class Instance {
  private renderer: Renderer
  private container: OpaqueRoot

  constructor(interaction: CommandInteraction) {
    this.renderer = new Renderer(interaction)
    this.container = reconciler.createContainer(this.renderer, 0, false, {})
  }

  render(content: ReactNode) {
    reconciler.updateContainer(content, this.container)
  }

  deactivate() {
    this.renderer.deactivate()
  }

  handleInteraction(interaction: MessageComponentInteraction) {
    return this.renderer.handleInteraction(interaction)
  }
}
