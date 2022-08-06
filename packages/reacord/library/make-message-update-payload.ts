import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  APISelectMenuComponent,
  APISelectMenuOption,
} from "discord-api-types/v10"
import { ButtonStyle, ComponentType } from "discord-api-types/v10"
import type { Node } from "./node"
import { TextNode } from "./node"
import { ActionRowNode } from "./react/action-row"
import type { ButtonProps } from "./react/button"
import { ButtonNode } from "./react/button"
import { EmbedNode } from "./react/embed"
import { EmbedAuthorNode } from "./react/embed-author"
import {
  EmbedFieldNameNode,
  EmbedFieldNode,
  EmbedFieldValueNode,
} from "./react/embed-field"
import { EmbedFooterNode } from "./react/embed-footer"
import { EmbedImageNode } from "./react/embed-image"
import { EmbedThumbnailNode } from "./react/embed-thumbnail"
import { EmbedTitleNode } from "./react/embed-title"
import { LinkNode } from "./react/link"
import {
  OptionDescriptionNode,
  OptionLabelNode,
  OptionNode,
} from "./react/option"
import { SelectNode } from "./react/select"

export type MessageUpdatePayload = {
  content: string | null
  embeds: APIEmbed[]
  components: Array<
    APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>
  >
}

export function makeMessageUpdatePayload(root: Node): MessageUpdatePayload {
  return {
    // eslint-disable-next-line unicorn/no-null
    content: root.extractText() || null,
    embeds: makeEmbeds(root),
    components: makeActionRows(root),
  }
}

function makeEmbeds(root: Node) {
  const embeds: APIEmbed[] = []

  for (const node of root.children) {
    if (node instanceof EmbedNode) {
      const { props, children } = node

      const embed: APIEmbed = {
        author: props.author && {
          name: props.author.name,
          icon_url: props.author.iconUrl,
          url: props.author.url,
        },
        color: props.color,
        description: props.description,
        fields: props.fields?.map(({ name, value, inline }) => ({
          name,
          value,
          inline,
        })),
        footer: props.footer && {
          text: props.footer.text,
          icon_url: props.footer.iconUrl,
        },
        image: props.image,
        thumbnail: props.thumbnail,
        title: props.title,
        url: props.url,
        video: props.video,
      }

      if (props.timestamp !== undefined) {
        embed.timestamp = normalizeDatePropToISOString(props.timestamp)
      }

      applyEmbedChildren(embed, children)

      embeds.push(embed)
    }
  }

  return embeds
}

function applyEmbedChildren(embed: APIEmbed, children: Node[]) {
  for (const child of children) {
    if (child instanceof EmbedAuthorNode) {
      embed.author = {
        name: child.extractText(),
        icon_url: child.props.iconUrl,
        url: child.props.url,
      }
    }

    if (child instanceof EmbedFieldNode) {
      embed.fields ??= []
      embed.fields.push({
        name: child.findInstanceOf(EmbedFieldNameNode)?.extractText() ?? "",
        value: child.findInstanceOf(EmbedFieldValueNode)?.extractText() ?? "",
        inline: child.props.inline,
      })
    }

    if (child instanceof EmbedFooterNode) {
      embed.footer = {
        text: child.extractText(),
        icon_url: child.props.iconUrl,
      }
      if (child.props.timestamp != undefined) {
        embed.timestamp = normalizeDatePropToISOString(child.props.timestamp)
      }
    }

    if (child instanceof EmbedImageNode) {
      embed.image = { url: child.props.url }
    }

    if (child instanceof EmbedThumbnailNode) {
      embed.thumbnail = { url: child.props.url }
    }

    if (child instanceof EmbedTitleNode) {
      embed.title = child.extractText()
      embed.url = child.props.url
    }

    if (child instanceof EmbedNode) {
      applyEmbedChildren(embed, child.children)
    }

    if (child instanceof TextNode) {
      embed.description ??= ""
      embed.description += child.props.text
    }
  }
}

function normalizeDatePropToISOString(value: string | number | Date) {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString()
}

function makeActionRows(root: Node) {
  const actionRows: Array<
    APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>
  > = []

  function getNextActionRow() {
    let currentRow = actionRows[actionRows.length - 1]
    if (
      !currentRow ||
      currentRow.components.length >= 5 ||
      currentRow.components[0]?.type === ComponentType.SelectMenu
    ) {
      currentRow = {
        type: ComponentType.ActionRow,
        components: [],
      }
      actionRows.push(currentRow)
    }
    return currentRow
  }

  for (const node of root.children) {
    if (node instanceof ButtonNode) {
      getNextActionRow().components.push({
        type: ComponentType.Button,
        custom_id: node.customId,
        label: node.extractText(Number.POSITIVE_INFINITY),
        emoji: node.props.emoji ? { name: node.props.emoji } : undefined,
        style: translateButtonStyle(node.props.style ?? "secondary"),
        disabled: node.props.disabled,
      })
    }

    if (node instanceof LinkNode) {
      getNextActionRow().components.push({
        type: ComponentType.Button,
        label: node.extractText(Number.POSITIVE_INFINITY),
        url: node.props.url,
        style: ButtonStyle.Link,
        disabled: node.props.disabled,
      })
    }

    if (node instanceof SelectNode) {
      const actionRow: APIActionRowComponent<APISelectMenuComponent> = {
        type: ComponentType.ActionRow,
        components: [],
      }
      actionRows.push(actionRow)

      let selectedValues: string[] = []
      if (node.props.multiple && node.props.values) {
        selectedValues = node.props.values ?? []
      }
      if (!node.props.multiple && node.props.value != undefined) {
        selectedValues = [node.props.value]
      }

      const options = [...node.children]
        .flatMap((child) => (child instanceof OptionNode ? child : []))
        .map<APISelectMenuOption>((child) => ({
          label:
            child.findInstanceOf(OptionLabelNode)?.extractText() ||
            child.props.value,
          description: child
            .findInstanceOf(OptionDescriptionNode)
            ?.extractText(),
          value: child.props.value,
          default: selectedValues.includes(child.props.value),
          emoji: { name: child.props.emoji },
        }))

      const select: APISelectMenuComponent = {
        type: ComponentType.SelectMenu,
        custom_id: node.customId,
        options,
        disabled: node.props.disabled,
      }

      if (node.props.multiple) {
        select.min_values = node.props.minValues
        select.max_values = node.props.maxValues
      }

      actionRow.components.push(select)
    }

    if (node instanceof ActionRowNode) {
      actionRows.push(...makeActionRows(node))
    }
  }

  return actionRows
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
