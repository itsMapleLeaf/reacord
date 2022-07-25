import type {
  Client,
  Interaction,
  Message,
  MessageEditOptions,
  MessageOptions,
  TextBasedChannel,
} from "discord.js"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import type { ReactNode } from "react"
import { AsyncQueue } from "./async-queue"
import type { ButtonProps } from "./button"
import { ButtonNode } from "./button"
import type { Node } from "./node"
import { TextNode } from "./node"
import type {
  ReacordMessageRenderer,
  ReacordOptions,
} from "./reacord-instance-pool"
import { ReacordInstancePool } from "./reacord-instance-pool"

export class ReacordDiscordJs {
  private instances

  constructor(private readonly client: Client, options: ReacordOptions = {}) {
    this.instances = new ReacordInstancePool(options)
  }

  send(channelId: string, initialContent?: ReactNode) {
    const renderer = new ChannelMessageRenderer(this.client, channelId)
    return this.instances.create({ initialContent, renderer })
  }

  reply(interaction: Interaction, initialContent?: ReactNode) {}

  ephemeralReply(interaction: Interaction, initialContent?: ReactNode) {}
}

class ChannelMessageRenderer implements ReacordMessageRenderer {
  private message: Message | undefined
  private channel: TextBasedChannel | undefined
  private active = true
  private readonly queue = new AsyncQueue()

  constructor(
    private readonly client: Client,
    private readonly channelId: string,
  ) {}

  update(nodes: ReadonlyArray<Node<unknown>>) {
    const rows: Array<ActionRowBuilder<ButtonBuilder>> = []

    for (const node of nodes) {
      if (node instanceof ButtonNode) {
        let currentRow = rows[rows.length - 1]
        if (!currentRow || currentRow.components.length === 5) {
          currentRow = new ActionRowBuilder()
          rows.push(currentRow)
        }

        currentRow.addComponents(
          new ButtonBuilder({
            label: node.label,
            customId: node.customId,
            emoji: node.props.emoji,
            disabled: node.props.disabled,
            style: node.props.style
              ? getButtonStyle(node.props.style)
              : ButtonStyle.Secondary,
          }),
        )
      }
    }

    const options: MessageOptions & MessageEditOptions = {
      content: nodes
        .map((node) => (node instanceof TextNode ? node.props.text : ""))
        .join(""),

      components: rows.length > 0 ? rows : undefined,
    }

    return this.queue.add(async () => {
      if (!this.active) {
        return
      }

      if (this.message) {
        await this.message.edit(options)
        return
      }

      const channel = await this.getChannel()
      this.message = await channel.send(options)
    })
  }

  destroy() {
    return this.queue.add(async () => {
      this.active = false
      await this.message?.delete()
    })
  }

  deactivate() {
    return this.queue.add(async () => {
      this.active = false
      // TODO: disable message components
    })
  }

  private async getChannel() {
    if (this.channel) {
      return this.channel
    }

    const channel =
      this.client.channels.cache.get(this.channelId) ??
      (await this.client.channels.fetch(this.channelId))

    if (!channel) {
      throw new Error(`Channel ${this.channelId} not found`)
    }
    if (!channel.isTextBased()) {
      throw new Error(`Channel ${this.channelId} is not a text channel`)
    }
    return (this.channel = channel)
  }
}

function getButtonStyle(style: NonNullable<ButtonProps["style"]>) {
  const styleMap = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    danger: ButtonStyle.Danger,
    success: ButtonStyle.Success,
  } as const
  return styleMap[style]
}
