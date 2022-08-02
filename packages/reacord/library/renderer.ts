import { AsyncQueue } from "@reacord/helpers/async-queue"
import type { Node } from "./internal/node.js"
import type { InteractionInfo } from "./reacord-client.js"

export type Renderer = {
  update(tree: Node<unknown>): Promise<void>
  deactivate(): Promise<void>
  destroy(): Promise<void>
}

export class ChannelMessageRenderer implements Renderer {
  private readonly queue = new AsyncQueue()

  constructor(private readonly channelId: string) {}

  update(tree: Node<unknown>): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class InteractionReplyRenderer implements Renderer {
  constructor(private readonly interaction: InteractionInfo) {}

  update(tree: Node<unknown>): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export class EphemeralInteractionReplyRenderer implements Renderer {
  constructor(private readonly interaction: InteractionInfo) {}

  update(tree: Node<unknown>): Promise<void> {
    throw new Error("Method not implemented.")
  }

  deactivate(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
