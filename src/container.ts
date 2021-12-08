import type { TextBasedChannels } from "discord.js"
import type { ReacordInstance } from "./instance.js"

export class ReacordContainer {
  channel: TextBasedChannels
  instances = new Set<ReacordInstance>()

  constructor(channel: TextBasedChannels) {
    this.channel = channel
  }

  add(instance: ReacordInstance) {
    this.instances.add(instance)
    instance.render(this.channel)
  }

  remove(instance: ReacordInstance) {
    this.instances.delete(instance)
    instance.destroy()
  }

  clear() {
    this.instances.forEach((instance) => {
      instance.destroy()
    })
    this.instances.clear()
  }
}
