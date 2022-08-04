import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  APISelectMenuComponent,
  APISelectMenuOption,
} from "discord-api-types/v10"
import { ButtonStyle, ComponentType } from "discord-api-types/v10"
import { ActionRowNode } from "./components/action-row"
import type { ButtonProps } from "./components/button"
import { ButtonNode } from "./components/button"
import { EmbedNode } from "./components/embed"
import { EmbedAuthorNode } from "./components/embed-author"
import {
  EmbedFieldNameNode,
  EmbedFieldNode,
  EmbedFieldValueNode,
} from "./components/embed-field"
import { EmbedFooterNode } from "./components/embed-footer"
import { EmbedImageNode } from "./components/embed-image"
import { EmbedThumbnailNode } from "./components/embed-thumbnail"
import { EmbedTitleNode } from "./components/embed-title"
import { LinkNode } from "./components/link"
import {
  OptionDescriptionNode,
  OptionLabelNode,
  OptionNode,
} from "./components/option"
import { SelectNode } from "./components/select"
import type { Node } from "./node"

export type MessageUpdatePayload = {
  content: string
  embeds: APIEmbed[]
  components: Array<
    APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>
  >
}

export function makeMessageUpdatePayload(root: Node): MessageUpdatePayload {
  return {
    content: root.extractText(),
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

  for (const node of root.children) {
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

    if (node instanceof ButtonNode) {
      currentRow.components.push({
        type: ComponentType.Button,
        custom_id: node.customId,
        label: node.extractText(Number.POSITIVE_INFINITY),
        emoji: { name: node.props.emoji },
        style: translateButtonStyle(node.props.style ?? "secondary"),
        disabled: node.props.disabled,
      })
    }

    if (node instanceof LinkNode) {
      currentRow.components.push({
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
          label: child.findInstanceOf(OptionLabelNode)?.extractText() ?? "",
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
