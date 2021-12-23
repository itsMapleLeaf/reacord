import type { ButtonInteraction } from "discord.js"
import type { Node } from "./node"

type InteractionHandler = {
  type: "button"
  customId: string
  onClick: (interaction: ButtonInteraction) => void
}

export function collectInteractionHandlers(node: Node): InteractionHandler[] {
  if (node.type === "button") {
    return [{ type: "button", customId: node.customId, onClick: node.onClick }]
  }

  if ("children" in node) {
    return node.children.flatMap(collectInteractionHandlers)
  }

  return []
}
