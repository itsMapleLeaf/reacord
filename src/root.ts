/* eslint-disable unicorn/no-null */
import type { TextBasedChannels } from "discord.js"
import type { ReactNode } from "react"
import { ChannelRenderer } from "./channel-renderer.js"
import { reconciler } from "./reconciler.js"

export type ReacordRoot = ReturnType<typeof createRoot>

export function createRoot(target: TextBasedChannels) {
  const renderer = new ChannelRenderer(target)
  const containerId = reconciler.createContainer(renderer, 0, false, null)
  return {
    render: (content: ReactNode) => {
      reconciler.updateContainer(content, containerId)
      return renderer.done()
    },
    destroy: () => {
      reconciler.updateContainer(null, containerId)
      renderer.destroy()
      return renderer.done()
    },
    done: () => renderer.done(),
  }
}
