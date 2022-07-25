import type {
  APIActionRowComponent,
  APIButtonComponent,
  RESTPostAPIChannelMessageJSONBody,
} from "discord-api-types/v10"
import { ButtonStyle, ComponentType } from "discord-api-types/v10"
import type { ButtonProps } from "./button"
import type { Node } from "./node"

export type MessagePayload = RESTPostAPIChannelMessageJSONBody

export function makeMessagePayload(tree: readonly Node[]) {
  const payload: MessagePayload = {}

  const content = tree
    .map((item) => (item.type === "text" ? item.props.text : ""))
    .join("")
  if (content) {
    payload.content = content
  }

  const actionRows = makeActionRows(tree)
  if (actionRows.length > 0) {
    payload.components = actionRows
  }

  return payload
}

function makeActionRows(tree: readonly Node[]) {
  const actionRows: Array<APIActionRowComponent<APIButtonComponent>> = []

  for (const node of tree) {
    if (node.type === "button") {
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
        custom_id: node.props.customId,
        label: extractText(node.children.getItems()),
        emoji: { name: node.props.emoji },
        style: translateButtonStyle(node.props.style ?? "secondary"),
        disabled: node.props.disabled,
      })
    }
  }

  return actionRows
}

function extractText(tree: readonly Node[]): string {
  return tree
    .map((item) => {
      return item.type === "text"
        ? item.props.text
        : extractText(item.children.getItems())
    })
    .join("")
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
