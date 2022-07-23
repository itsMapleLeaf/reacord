import type {
  Client,
  Interaction,
  Message,
  MessageEditOptions,
  MessageOptions,
} from "discord.js"
import type { ReactNode } from "react"
import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"

export function createReacordDiscordJs(client: Client) {
  return {
    send(channelId: string, initialContent?: ReactNode) {
      let message: Message | undefined

      const tree: MessageTree = {
        children: [],
        render: async () => {
          const messageOptions: MessageOptions & MessageEditOptions = {
            content: tree.children.map((child) => child.text).join(""),
          }

          try {
            if (message) {
              await message.edit(messageOptions)
              return
            }

            let channel = client.channels.cache.get(channelId)
            if (!channel) {
              channel = (await client.channels.fetch(channelId)) ?? undefined
            }
            if (!channel) {
              throw new Error(`Channel ${channelId} not found`)
            }
            if (!channel.isTextBased()) {
              throw new Error(`Channel ${channelId} is not a text channel`)
            }
            message = await channel.send(messageOptions)
          } catch (error) {
            console.error(
              "Reacord encountered an error while rendering.",
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

      const instance = {
        render(content: ReactNode) {
          reconciler.updateContainer(content, container)
        },
      }

      if (initialContent !== undefined) {
        instance.render(initialContent)
      }

      return instance
    },
    reply(interaction: Interaction, initialContent?: ReactNode) {},
    ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {},
  }
}

type MessageTree = {
  children: TextNode[]
  render: () => void
}

type TextNode = {
  type: "text"
  text: string
}

const reconciler = ReactReconciler<
  string, // Type
  Record<string, unknown>, // Props
  MessageTree, // Container
  never, // Instance
  TextNode, // TextInstance
  never, // SuspenseInstance
  never, // HydratableInstance
  never, // PublicInstance
  {}, // HostContext
  true, // UpdatePayload
  never, // ChildSet
  NodeJS.Timeout, // TimeoutHandle
  -1 // NoTimeout
>({
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  createInstance() {
    throw new Error("Not implemented")
  },

  createTextInstance(text) {
    return { type: "text", text }
  },

  appendInitialChild(parent, child) {},

  appendChild(parentInstance, child) {},

  appendChildToContainer(container, child) {
    container.children.push(child)
  },

  insertBefore(parentInstance, child, beforeChild) {},

  insertInContainerBefore(container, child, beforeChild) {
    const index = container.children.indexOf(beforeChild)
    if (index !== -1) container.children.splice(index, 0, child)
  },

  removeChild(parentInstance, child) {},

  removeChildFromContainer(container, child) {
    container.children = container.children.filter((c) => c !== child)
  },

  clearContainer(container) {
    container.children = []
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText
  },

  commitUpdate(
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle,
  ) {},

  prepareForCommit() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },

  resetAfterCommit(container) {
    container.render()
  },

  finalizeInitialChildren() {
    return false
  },

  prepareUpdate() {
    return true
  },

  shouldSetTextContent() {
    return false
  },

  getRootHostContext() {
    return {}
  },

  getChildHostContext() {
    return {}
  },

  getPublicInstance() {
    throw new Error("Refs are not supported")
  },

  preparePortalMount() {},

  getCurrentEventPriority() {
    return DefaultEventPriority
  },

  getInstanceFromNode() {
    return undefined
  },

  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate() {},
  getInstanceFromScope() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },
  detachDeletedInstance() {},
})
