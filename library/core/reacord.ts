import type { ReactNode } from "react"
import { ChannelMessageRenderer } from "../internal/channel-message-renderer"
import { CommandReplyRenderer } from "../internal/command-reply-renderer.js"
import { reconciler } from "../internal/reconciler.js"
import type { Renderer } from "../internal/renderer"
import type { Adapter, AdapterGenerics } from "./adapters/adapter"

export type ReacordConfig<Generics extends AdapterGenerics> = {
  adapter: Adapter<Generics>

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

export class Reacord<Generics extends AdapterGenerics> {
  private renderers: Renderer[] = []

  constructor(private readonly config: ReacordConfig<Generics>) {
    config.adapter.addComponentInteractionListener((interaction) => {
      for (const renderer of this.renderers) {
        if (renderer.handleComponentInteraction(interaction)) return
      }
    })
  }

  private get maxInstances() {
    return this.config.maxInstances ?? 50
  }

  send(init: Generics["channelInit"]): ReacordInstance {
    return this.createInstance(
      new ChannelMessageRenderer(this.config.adapter.createChannel(init)),
    )
  }

  reply(init: Generics["commandReplyInit"]): ReacordInstance {
    return this.createInstance(
      new CommandReplyRenderer(
        this.config.adapter.createCommandInteraction(init),
      ),
    )
  }

  private createInstance(renderer: Renderer) {
    if (this.renderers.length > this.maxInstances) {
      this.deactivate(this.renderers[0]!)
    }

    this.renderers.push(renderer)

    const container = reconciler.createContainer(renderer, 0, false, {})

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
