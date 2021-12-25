import type {
  Client,
  CommandInteraction,
  MessageComponentInteraction,
} from "discord.js"
import type { ReactNode } from "react"
import type { OpaqueRoot } from "react-reconciler"
import { reconciler } from "./reconciler.js"
import { Renderer } from "./renderer.js"

export class InstanceManager {
  private instances = new Set<Instance>()

  private constructor() {}

  static create(client: Client) {
    const manager = new InstanceManager()

    client.on("interactionCreate", (interaction) => {
      if (!interaction.isMessageComponent()) return
      for (const instance of manager.instances) {
        if (instance.handleInteraction(interaction)) return
      }
    })

    return manager
  }

  create(interaction: CommandInteraction) {
    const instance = new Instance(interaction)
    this.instances.add(instance)
    return instance
  }

  destroy(instance: Instance) {
    this.instances.delete(instance)
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

  handleInteraction(interaction: MessageComponentInteraction) {
    return this.renderer.handleInteraction(interaction)
  }
}
