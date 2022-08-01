import type { ReactNode } from "react"
import type { ButtonClickEvent } from "./button.js"
import { ButtonNode } from "./button.js"
import type { HostElement } from "./host-element.js"
import { Node } from "./node.js"
import { reconciler } from "./reconciler.js"

export type ReacordRenderer = {
  updateMessage(tree: HostElement): Promise<void>
}

export class ReacordInstance {
  readonly currentTree = new Node()
  private latestTree?: Node
  private readonly reconcilerContainer = reconciler.createContainer()

  constructor(private readonly renderer: ReacordRenderer) {}

  render(content?: ReactNode) {
    reconciler.updateContainer(content, this.reconcilerContainer)
  }

  async updateMessage(tree: Node) {
    await this.renderer.updateMessage(tree)
    this.latestTree = tree
  }

  handleButtonInteraction(customId: string, event: ButtonClickEvent) {
    if (!this.latestTree) return
    for (const node of this.latestTree.walk()) {
      if (node instanceof ButtonNode && node.customId === customId) {
        node.props.onClick(event)
      }
    }
  }
}
