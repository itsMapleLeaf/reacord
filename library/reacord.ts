import type { ReactNode } from "react"
import type { Adapter } from "./adapter/adapter"
import { reconciler } from "./reconciler.js"
import { Renderer } from "./renderer.js"

export type ReacordConfig<InteractionInit> = {
  adapter: Adapter<InteractionInit>

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

export class Reacord<InteractionInit> {
  private renderers: Renderer[] = []

  constructor(private readonly config: ReacordConfig<InteractionInit>) {
    config.adapter.addComponentInteractionListener((interaction) => {
      for (const renderer of this.renderers) {
        if (renderer.handleComponentInteraction(interaction)) return
      }
    })
  }

  private get maxInstances() {
    return this.config.maxInstances ?? 50
  }

  createCommandReply(target: InteractionInit): ReacordInstance {
    if (this.renderers.length > this.maxInstances) {
      this.deactivate(this.renderers[0]!)
    }

    const renderer = new Renderer(
      this.config.adapter.createCommandInteraction(target),
    )

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
