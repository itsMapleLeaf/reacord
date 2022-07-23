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

export function createReacordInstanceManager({
  maxInstances = 50,
}: ReacordOptions) {
  const instances: ReacordInstance[] = []

  function createInstance(...args: Parameters<typeof createReacordInstance>) {
    const instance = createReacordInstance(...args)
    instances.push(instance)

    if (instances.length > maxInstances) {
      instances.shift()?.deactivate()
    }

    return instance
  }

  return { createInstance }
}

function createReacordInstance(
  initialContent: ReactNode,
  render: (tree: MessageTree) => unknown,
): ReacordInstance {
  const tree: MessageTree = {
    children: [],
    render: async () => {
      try {
        await render(tree)
      } catch (error) {
        console.error(
          "Reacord encountered an error while updating the message.",
          error,
        )
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
    render(content: ReactNode) {
      reconciler.updateContainer(content, container)
    },
    destroy() {},
    deactivate() {},
  }

  if (initialContent !== undefined) {
    instance.render(initialContent)
  }

  return instance
}
