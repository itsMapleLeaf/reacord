import type { TextBasedChannels } from "discord.js"
import type { ReactNode } from "react"
import { reconciler } from "./reconciler"
import { ReacordContainer } from "./renderer/container"

export type ReacordRenderTarget = TextBasedChannels

export function createRoot(target: ReacordRenderTarget) {
  const container = new ReacordContainer(target)
  // eslint-disable-next-line unicorn/no-null
  const containerId = reconciler.createContainer(container, 0, false, null)
  return {
    render: (content: ReactNode) => {
      reconciler.updateContainer(content, containerId)
      return container.completion()
    },
  }
}
