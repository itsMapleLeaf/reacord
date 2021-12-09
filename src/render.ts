/* eslint-disable unicorn/no-null */
import type { TextBasedChannels } from "discord.js"
import { ReacordContainer } from "./container"
import { reconciler } from "./reconciler"

export type ReacordRenderTarget = TextBasedChannels

export function render(content: string, target: ReacordRenderTarget) {
  const container = new ReacordContainer(target)
  const containerId = reconciler.createContainer(container, 0, false, null)
  reconciler.updateContainer(content, containerId)
  return {
    destroy: () => {
      reconciler.updateContainer(null, containerId)
    },
  }
}
