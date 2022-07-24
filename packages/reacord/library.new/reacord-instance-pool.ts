import type { ReactNode } from "react"
import type { MessageTree } from "./message-tree"
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
  update: (tree: MessageTree) => Promise<void>
  deactivate: () => Promise<void>
  destroy: () => Promise<void>
}

export class ReacordInstancePool {
  private readonly options: Required<ReacordOptions>
  private readonly instances = new Set<ReacordInstance>()

  constructor({ maxInstances = 50 }: ReacordOptions) {
    this.options = { maxInstances }
  }

  create(options: ReacordInstanceOptions) {
    const tree: MessageTree = {
      children: [],
      render: async () => {
        try {
          await options.update(tree)
        } catch (error) {
          console.error("Failed to update message.", error)
        }
      },
    }

    const container = reconciler.createContainer(
      tree,
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
          await options.deactivate()
        } catch (error) {
          console.error("Failed to deactivate message.", error)
        }
      },
      destroy: async () => {
        this.instances.delete(instance)
        try {
          await options.destroy()
        } catch (error) {
          console.error("Failed to destroy message.", error)
        }
      },
    }

    if (options.initialContent !== undefined) {
      instance.render(options.initialContent)
    }

    if (this.instances.size > this.options.maxInstances) {
      ;[...this.instances][0]?.deactivate()
    }

    return instance
  }
}
