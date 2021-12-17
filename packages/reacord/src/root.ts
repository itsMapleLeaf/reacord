/* eslint-disable unicorn/no-null */
import type { TextBasedChannels } from "discord.js"
import type { ReactNode } from "react"
import { reconciler } from "./reconciler"
import { ReacordContainer } from "./renderer/container"

export type ReacordRenderTarget = TextBasedChannels

export function createRoot(target: ReacordRenderTarget) {
  const container = new ReacordContainer(target)
  const containerId = reconciler.createContainer(container, 0, false, null)
  return {
    render: (content: ReactNode) => {
      reconciler.updateContainer(content, containerId)
      return container.completion()
    },
    destroy: () => {
      reconciler.updateContainer(null, containerId)
      container.destroy()
      return container.completion()
    },
  }
}
