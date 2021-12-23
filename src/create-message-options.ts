import type {
  BaseMessageComponentOptions,
  MessageActionRowOptions,
  MessageEmbedOptions,
  MessageOptions,
} from "discord.js"
import { last } from "./helpers/last.js"
import { toUpper } from "./helpers/to-upper.js"
import type { EmbedNode, MessageNode, Node } from "./node"

export function createMessageOptions(node: MessageNode): MessageOptions {
  if (node.children.length === 0) {
    // can't send an empty message
    return { content: "_ _" }
  }

  const options: MessageOptions = {}

  for (const child of node.children) {
    if (child.type === "text" || child.type === "textElement") {
      options.content = `${options.content ?? ""}${getNodeText(child)}`
    }

    if (child.type === "embed") {
      options.embeds ??= []
      options.embeds.push(getEmbedOptions(child))
    }

    if (child.type === "actionRow") {
      options.components ??= []
      options.components.push({
        type: "ACTION_ROW",
        components: [],
      })
      addActionRowItems(options.components, child.children)
    }

    if (child.type === "button") {
      options.components ??= []
      addActionRowItems(options.components, [child])
    }
  }

  if (!options.content && !options.embeds?.length) {
    options.content = "_ _"
  }

  return options
}

function getNodeText(node: Node): string | undefined {
  if (node.type === "text") {
    return node.text
  }
  if (node.type === "textElement") {
    return node.children.map(getNodeText).join("")
  }
}

function getEmbedOptions(node: EmbedNode) {
  const options: MessageEmbedOptions = {
    title: node.title,
    color: node.color,
    url: node.url,
    timestamp: node.timestamp ? new Date(node.timestamp) : undefined,
    image: { url: node.imageUrl },
    thumbnail: { url: node.thumbnailUrl },
    description: node.children.map(getNodeText).join(""),
    author: node.author
      ? { ...node.author, iconURL: node.author.iconUrl }
      : undefined,
    footer: node.footer
      ? { text: node.footer.text, iconURL: node.footer.iconUrl }
      : undefined,
  }

  for (const child of node.children) {
    if (child.type === "embedField") {
      options.fields ??= []
      options.fields.push({
        name: child.name,
        value: child.children.map(getNodeText).join("") || "_ _",
        inline: child.inline,
      })
    }
  }

  if (!options.description && !options.author) {
    options.description = "_ _"
  }

  return options
}

type ActionRowOptions = Required<BaseMessageComponentOptions> &
  MessageActionRowOptions

function addActionRowItems(components: ActionRowOptions[], nodes: Node[]) {
  let actionRow = last(components)

  if (
    actionRow == undefined ||
    actionRow.components[0]?.type === "SELECT_MENU" ||
    actionRow.components.length >= 5
  ) {
    actionRow = {
      type: "ACTION_ROW",
      components: [],
    }
    components.push(actionRow)
  }

  for (const node of nodes) {
    if (node.type === "button") {
      actionRow.components.push({
        type: "BUTTON",
        label: node.children.map(getNodeText).join(""),
        style: node.style ? toUpper(node.style) : "SECONDARY",
        emoji: node.emoji,
        disabled: node.disabled,
        customId: node.customId,
      })
    }
  }
}
