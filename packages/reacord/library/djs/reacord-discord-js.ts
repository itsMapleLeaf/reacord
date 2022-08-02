/* eslint-disable class-methods-use-this */
import { raise } from "@reacord/helpers/raise"
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
} from "discord.js"
import * as Discord from "discord.js"
import type { ReactNode } from "react"

import type { ReacordInstance } from "../core/instance"
import type { ReacordConfig } from "../core/reacord"
import { Reacord } from "../core/reacord"
import type { ComponentInteraction } from "../internal/interaction"
import type {
  Message,
  MessageButtonOptions,
  MessageOptions,
} from "../internal/message"
import { ChannelMessageRenderer } from "../internal/renderers/channel-message-renderer"
import { InteractionReplyRenderer } from "../internal/renderers/interaction-reply-renderer"

/**
 * The Reacord adapter for Discord.js.
 * @category Core
 */
export class ReacordDiscordJs extends Reacord {
  constructor(private client: Discord.Client, config: ReacordConfig = {}) {
    super(config)

    client.on("interactionCreate", (interaction) => {
      if (interaction.isButton() || interaction.isSelectMenu()) {
        this.handleComponentInteraction(
          this.createReacordComponentInteraction(interaction),
        )
      }
    })

    client.ws.on(
      Discord.GatewayDispatchEvents.InteractionCreate,
      (data: Discord.APIInteraction) => {
        if (data.type === Discord.InteractionType.MessageComponent) {
          data
          // this.handleComponentInteraction(
          //   this.createReacordComponentInteraction(data),
          // )
        }
      },
    )
  }

  /**
   * Sends a message to a channel.
   * @see https://reacord.mapleleaf.dev/guides/sending-messages
   */
  override send(
    channelId: string,
    initialContent?: React.ReactNode,
  ): ReacordInstance {
    return this.createInstance(
      this.createChannelRenderer(channelId),
      initialContent,
    )
  }

  /**
   * Sends a message as a reply to a command interaction.
   * @see https://reacord.mapleleaf.dev/guides/sending-messages
   */
  override reply(
    interaction: Discord.CommandInteraction,
    initialContent?: React.ReactNode,
  ): ReacordInstance {
    return this.createInstance(
      this.createInteractionReplyRenderer(interaction),
      initialContent,
    )
  }

  /**
   * Sends an ephemeral message as a reply to a command interaction.
   * @see https://reacord.mapleleaf.dev/guides/sending-messages
   */
  override ephemeralReply(
    interaction: Discord.CommandInteraction,
    initialContent?: React.ReactNode,
  ): ReacordInstance {
    return this.createInstance(
      this.createEphemeralInteractionReplyRenderer(interaction),
      initialContent,
    )
  }

  private createChannelRenderer(channelId: string) {
    return new ChannelMessageRenderer({
      send: async (options) => {
        const channel =
          this.client.channels.cache.get(channelId) ??
          (await this.client.channels.fetch(channelId)) ??
          raise(`Channel ${channelId} not found`)

        if (!channel.isTextBased()) {
          raise(`Channel ${channelId} is not a text channel`)
        }

        const message = await channel.send(getDiscordMessageOptions(options))
        return createReacordMessage(message)
      },
    })
  }

  private createInteractionReplyRenderer(
    interaction:
      | Discord.CommandInteraction
      | Discord.MessageComponentInteraction,
  ) {
    return new InteractionReplyRenderer({
      type: "command",
      id: interaction.id,
      reply: async (options) => {
        const message = await interaction.reply({
          ...getDiscordMessageOptions(options),
          fetchReply: true,
        })
        return createReacordMessage(message as Discord.Message)
      },
      followUp: async (options) => {
        const message = await interaction.followUp({
          ...getDiscordMessageOptions(options),
          fetchReply: true,
        })
        return createReacordMessage(message as Discord.Message)
      },
    })
  }

  private createEphemeralInteractionReplyRenderer(
    interaction:
      | Discord.CommandInteraction
      | Discord.MessageComponentInteraction,
  ) {
    return new InteractionReplyRenderer({
      type: "command",
      id: interaction.id,
      reply: async (options) => {
        await interaction.reply({
          ...getDiscordMessageOptions(options),
          ephemeral: true,
        })
        return createEphemeralReacordMessage()
      },
      followUp: async (options) => {
        await interaction.followUp({
          ...getDiscordMessageOptions(options),
          ephemeral: true,
        })
        return createEphemeralReacordMessage()
      },
    })
  }

  private createReacordComponentInteraction(
    interaction: Discord.MessageComponentInteraction,
  ): ComponentInteraction {
    const baseProps = {
      id: interaction.id,
      customId: interaction.customId,
      update: async (options: MessageOptions) => {
        await interaction.update(getDiscordMessageOptions(options))
      },
      deferUpdate: async () => {
        if (interaction.replied || interaction.deferred) return
        await interaction.deferUpdate()
      },
      reply: async (options: MessageOptions) => {
        const message = await interaction.reply({
          ...getDiscordMessageOptions(options),
          fetchReply: true,
        })
        return createReacordMessage(message as Discord.Message)
      },
      followUp: async (options: MessageOptions) => {
        const message = await interaction.followUp({
          ...getDiscordMessageOptions(options),
          fetchReply: true,
        })
        return createReacordMessage(message as Discord.Message)
      },
      event: {
        reply: (content?: ReactNode) =>
          this.createInstance(
            this.createInteractionReplyRenderer(interaction),
            content,
          ),

        ephemeralReply: (content: ReactNode) =>
          this.createInstance(
            this.createEphemeralInteractionReplyRenderer(interaction),
            content,
          ),
      },
    }

    if (interaction.isButton()) {
      return {
        ...baseProps,
        type: "button",
        event: {
          ...baseProps.event,
          interaction:
            interaction.toJSON() as APIMessageComponentButtonInteraction,
        },
      }
    }

    if (interaction.isSelectMenu()) {
      return {
        ...baseProps,
        type: "select",
        event: {
          ...baseProps.event,
          values: interaction.values,
          interaction:
            interaction.toJSON() as APIMessageComponentSelectMenuInteraction,
        },
      }
    }

    raise(`Unsupported component interaction type: ${interaction.type}`)
  }
}

function createReacordMessage(message: Discord.Message): Message {
  return {
    edit: async (options) => {
      await message.edit(getDiscordMessageOptions(options))
    },
    delete: async () => {
      await message.delete()
    },
  }
}

function createEphemeralReacordMessage(): Message {
  return {
    edit: () => {
      console.warn("Ephemeral messages can't be edited")
      return Promise.resolve()
    },
    delete: () => {
      console.warn("Ephemeral messages can't be deleted")
      return Promise.resolve()
    },
  }
}

function convertButtonStyleToEnum(style: MessageButtonOptions["style"]) {
  const styleMap = {
    primary: Discord.ButtonStyle.Primary,
    secondary: Discord.ButtonStyle.Secondary,
    success: Discord.ButtonStyle.Success,
    danger: Discord.ButtonStyle.Danger,
  } as const

  return styleMap[style ?? "secondary"]
}

// TODO: this could be a part of the core library,
// and also handle some edge cases, e.g. empty messages
function getDiscordMessageOptions(reacordOptions: MessageOptions) {
  const options = {
    // eslint-disable-next-line unicorn/no-null
    content: reacordOptions.content || null,
    embeds: reacordOptions.embeds,
    components: reacordOptions.actionRows.map((row) => ({
      type: Discord.ComponentType.ActionRow,
      components: row.map(
        (component): Discord.MessageActionRowComponentData => {
          if (component.type === "button") {
            return {
              type: Discord.ComponentType.Button,
              customId: component.customId,
              label: component.label ?? "",
              style: convertButtonStyleToEnum(component.style),
              disabled: component.disabled,
              emoji: component.emoji,
            }
          }

          if (component.type === "select") {
            return {
              ...component,
              type: Discord.ComponentType.SelectMenu,
              options: component.options.map((option) => ({
                ...option,
                default: component.values?.includes(option.value),
              })),
            }
          }

          raise(`Unsupported component type: ${component.type}`)
        },
      ),
    })),
  }

  if (!options.content && !options.embeds?.length) {
    options.content = "_ _"
  }

  return options
}
