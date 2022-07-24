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

type ReacordInstanceOptions = {
  initialContent: ReactNode
  update: (tree: MessageTree) => unknown
  deactivate: () => unknown
  destroy: () => unknown
}

export function createReacordInstanceManager({
  maxInstances = 50,
}: ReacordOptions) {
  const instances: ReacordInstance[] = []

  function createInstance(options: ReacordInstanceOptions) {
    const instance = createReacordInstance({
      ...options,
      deactivate() {
        instances.splice(instances.indexOf(instance), 1)
        return options.deactivate()
      },
      destroy() {
        instances.splice(instances.indexOf(instance), 1)
        return options.destroy()
      },
    })

    instances.push(instance)

    if (instances.length > maxInstances) {
      instances.shift()?.deactivate()
    }

    return instance
  }

  return { createInstance }
}

function createReacordInstance(
  options: ReacordInstanceOptions,
): ReacordInstance {
  const tree: MessageTree = {
    children: [],
    render: async () => {
      try {
        await options.update(tree)
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
    async deactivate() {
      try {
        await options.deactivate()
      } catch (error) {
        console.error(
          "Reacord encountered an error while deactivating an instance.",
          error,
        )
      }
    },
    async destroy() {
      try {
        await options.destroy()
      } catch (error) {
        console.error(
          "Reacord encountered an error while destroying an instance.",
          error,
        )
      }
    },
  }

  if (options.initialContent !== undefined) {
    instance.render(options.initialContent)
  }

  return instance
}
