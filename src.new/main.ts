import type { CommandInteraction } from "discord.js"
import type { ReactNode } from "react"
import type { OpaqueRoot } from "react-reconciler"
import { reconciler } from "./reconciler.js"
import { RootNode } from "./root-node.js"

export class InstanceManager {
  private instances = new Set<Instance>()

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
  private rootNode: RootNode
  private container: OpaqueRoot

  constructor(interaction: CommandInteraction) {
    this.rootNode = new RootNode(interaction)
    this.container = reconciler.createContainer(this.rootNode, 0, false, {})
  }

  render(content: ReactNode) {
    reconciler.updateContainer(content, this.container)
  }
}
