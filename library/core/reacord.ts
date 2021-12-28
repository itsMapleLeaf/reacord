import type { ReactNode } from "react"
import type { ComponentInteraction } from "../internal/interaction"
import { reconciler } from "../internal/reconciler.js"
import type { Renderer } from "../internal/renderer"

export type ReacordConfig = {
  /**
   * The max number of active instances.
   * When this limit is exceeded, the oldest instances will be disabled.
   */
  maxInstances?: number
}

export type ReacordInstance = {
  render: (content: ReactNode) => void
  deactivate: () => void
  destroy: () => void
}

export type ComponentInteractionListener = (
  interaction: ComponentInteraction,
) => void

export abstract class Reacord {
  private renderers: Renderer[] = []

  constructor(private readonly config: ReacordConfig = {}) {}

  abstract send(channel: unknown, initialContent?: ReactNode): ReacordInstance

  abstract reply(
    commandInteraction: unknown,
    initialContent?: ReactNode,
  ): ReacordInstance

  protected handleComponentInteraction(interaction: ComponentInteraction) {
    for (const renderer of this.renderers) {
      if (renderer.handleComponentInteraction(interaction)) return
    }
  }

  private get maxInstances() {
    return this.config.maxInstances ?? 50
  }

  protected createInstance(renderer: Renderer, initialContent?: ReactNode) {
    if (this.renderers.length > this.maxInstances) {
      this.deactivate(this.renderers[0]!)
    }

    this.renderers.push(renderer)

    const container = reconciler.createContainer(renderer, 0, false, {})

    if (initialContent !== undefined) {
      reconciler.updateContainer(initialContent, container)
    }

    return {
      render: (content: ReactNode) => {
        reconciler.updateContainer(content, container)
      },
      deactivate: () => {
        this.deactivate(renderer)
      },
      destroy: () => {
        this.renderers = this.renderers.filter((it) => it !== renderer)
        renderer.destroy()
      },
    }
  }

  private deactivate(renderer: Renderer) {
    this.renderers = this.renderers.filter((it) => it !== renderer)
    renderer.deactivate()
  }
}
