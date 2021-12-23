import type {
  ButtonInteraction,
  ColorResolvable,
  EmojiResolvable,
} from "discord.js"
import type { ButtonStyle } from "./components/button.jsx"

export type MessageNode = {
  type: "message"
  children: Node[]
}

export type TextNode = {
  type: "text"
  text: string
}

type TextElementNode = {
  type: "textElement"
  children: Node[]
}

export type EmbedNode = {
  type: "embed"
  title?: string
  color?: ColorResolvable
  url?: string
  timestamp?: Date | number | string
  imageUrl?: string
  thumbnailUrl?: string
  author?: {
    name: string
    url?: string
    iconUrl?: string
  }
  footer?: {
    text: string
    iconUrl?: string
  }
  children: Node[]
}

type EmbedFieldNode = {
  type: "embedField"
  name: string
  inline?: boolean
  children: Node[]
}

type ActionRowNode = {
  type: "actionRow"
  children: Node[]
}

type ButtonNode = {
  type: "button"
  style?: ButtonStyle
  emoji?: EmojiResolvable
  disabled?: boolean
  customId: string
  onClick: (interaction: ButtonInteraction) => void
  children: Node[]
}

export type Node =
  | MessageNode
  | TextNode
  | TextElementNode
  | EmbedNode
  | EmbedFieldNode
  | ActionRowNode
  | ButtonNode
