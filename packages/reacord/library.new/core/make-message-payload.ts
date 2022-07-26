import type {
  APIActionRowComponent,
  APIButtonComponent,
  RESTPostAPIChannelMessageJSONBody,
} from "discord-api-types/v10"
import { ButtonStyle, ComponentType } from "discord-api-types/v10"
import type { ButtonProps } from "./button"
import { ButtonNode } from "./button"
import type { Node } from "./node"
import { TextNode } from "./text-node"

export type MessageUpdatePayload = RESTPostAPIChannelMessageJSONBody

export function makeMessageUpdatePayload(root: Node) {
  const payload: MessageUpdatePayload = {}

  const content = extractText(root, 1)
  if (content) {
    payload.content = content
  }

  const actionRows = makeActionRows(root)
  if (actionRows.length > 0) {
    payload.components = actionRows
  }

  return payload
}

function makeActionRows(root: Node) {
  const actionRows: Array<APIActionRowComponent<APIButtonComponent>> = []

  for (const node of root.children) {
    if (node instanceof ButtonNode) {
      let currentRow = actionRows[actionRows.length - 1]
      if (!currentRow || currentRow.components.length === 5) {
        currentRow = {
          type: ComponentType.ActionRow,
          components: [],
        }
        actionRows.push(currentRow)
      }

      currentRow.components.push({
        type: ComponentType.Button,
        custom_id: node.customId,
        label: extractText(node, Number.POSITIVE_INFINITY),
        emoji: { name: node.props.emoji },
        style: translateButtonStyle(node.props.style ?? "secondary"),
        disabled: node.props.disabled,
      })
    }
  }

  return actionRows
}

function extractText(node: Node, depth: number): string {
  if (node instanceof TextNode) return node.props.text
  if (depth <= 0) return ""
  return node.children.map((child) => extractText(child, depth - 1)).join("")
}

function translateButtonStyle(style: NonNullable<ButtonProps["style"]>) {
  const styleMap = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    danger: ButtonStyle.Danger,
    success: ButtonStyle.Success,
  } as const
  return styleMap[style]
}
