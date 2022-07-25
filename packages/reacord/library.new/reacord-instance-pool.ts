import type { ReactNode } from "react"
import { Container } from "./container"
import type { MessagePayload } from "./make-message-payload"
import { makeMessagePayload } from "./make-message-payload"
import type { Node } from "./node"
import { reconciler } from "./reconciler"

export type ReacordOptions = {
  /**
   * The max number of active instances.
   * When this limit is exceeded, the oldest instances will be disabled.
   */
  maxInstances?: number
}

export type ReacordInstance = {
  /** Render some JSX to this instance (edits the message) */
  render: (content: ReactNode) => void

  /** Remove this message */
  destroy: () => void

  /**
   * Same as destroy, but keeps the message and disables the components on it.
   * This prevents it from listening to user interactions.
   */
  deactivate: () => void
}

export type ReacordInstanceOptions = {
  initialContent: ReactNode
  renderer: ReacordMessageRenderer
}

export type ReacordMessageRenderer = {
  update: (payload: MessagePayload) => Promise<void>
  deactivate: () => Promise<void>
  destroy: () => Promise<void>
}

export class ReacordInstancePool {
  private readonly options: Required<ReacordOptions>
  private readonly instances = new Set<ReacordInstance>()

  constructor({ maxInstances = 50 }: ReacordOptions) {
    this.options = { maxInstances }
  }

  create({ initialContent, renderer }: ReacordInstanceOptions) {
    const nodes = new Container<Node>()

    const render = async () => {
      try {
        await renderer.update(makeMessagePayload(nodes.getItems()))
      } catch (error) {
        console.error("Failed to update message.", error)
      }
    }

    const container = reconciler.createContainer(
      { nodes, render },
      0,
      // eslint-disable-next-line unicorn/no-null
      null,
      false,
      // eslint-disable-next-line unicorn/no-null
      null,
      "reacord",
      () => {},
      // eslint-disable-next-line unicorn/no-null
      null,
    )

    const instance: ReacordInstance = {
      render: (content: ReactNode) => {
        reconciler.updateContainer(content, container)
      },
      deactivate: async () => {
        this.instances.delete(instance)
        try {
          await renderer.deactivate()
        } catch (error) {
          console.error("Failed to deactivate message.", error)
        }
      },
      destroy: async () => {
        this.instances.delete(instance)
        try {
          await renderer.destroy()
        } catch (error) {
          console.error("Failed to destroy message.", error)
        }
      },
    }

    if (initialContent !== undefined) {
      instance.render(initialContent)
    }

    if (this.instances.size > this.options.maxInstances) {
      ;[...this.instances][0]?.deactivate()
    }

    return instance
  }
}
