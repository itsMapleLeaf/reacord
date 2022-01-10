/* eslint-disable class-methods-use-this */
import * as Discord from "discord.js"
import type { ReactNode } from "react"
import type { Except } from "type-fest"
import { pick } from "../../helpers/pick"
import { pruneNullishValues } from "../../helpers/prune-null-values"
import { raise } from "../../helpers/raise"
import { toUpper } from "../../helpers/to-upper"
import type { ComponentInteraction } from "../internal/interaction"
import type { Message, MessageOptions } from "../internal/message"
import { ChannelMessageRenderer } from "../internal/renderers/channel-message-renderer"
import { InteractionReplyRenderer } from "../internal/renderers/interaction-reply-renderer"
import type {
  ChannelInfo,
  GuildInfo,
  GuildMemberInfo,
  MessageInfo,
  UserInfo,
} from "./component-event"
import type { ReacordInstance } from "./instance"
import type { ReacordConfig } from "./reacord"
import { Reacord } from "./reacord"

/**
 * The Reacord adapter for Discord.js.
 * @category Core
 */
export class ReacordDiscordJs extends Reacord {
  constructor(private client: Discord.Client, config: ReacordConfig = {}) {
    super(config)

    client.on("interactionCreate", (interaction) => {
      if (interaction.isMessageComponent()) {
        this.handleComponentInteraction(
          this.createReacordComponentInteraction(interaction),
        )
      }
    })
  }

  /**
   * Sends a message to a channel.
   * @see https://reacord.fly.dev/guides/sending-messages
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
   * @see https://reacord.fly.dev/guides/sending-messages
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
   * @see https://reacord.fly.dev/guides/sending-messages
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

        if (!channel.isText()) {
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
    // todo please dear god clean this up
    const channel: ChannelInfo = interaction.channel
      ? {
          ...pick(pruneNullishValues(interaction.channel), [
            "topic",
            "nsfw",
            "lastMessageId",
            "ownerId",
            "parentId",
            "rateLimitPerUser",
          ]),
          id: interaction.channelId,
        }
      : raise("Non-channel interactions are not supported")

    const message: MessageInfo =
      interaction.message instanceof Discord.Message
        ? {
            ...pick(interaction.message, [
              "id",
              "channelId",
              "authorId",
              "content",
              "tts",
              "mentionEveryone",
            ]),
            timestamp: new Date(
              interaction.message.createdTimestamp,
            ).toISOString(),
            editedTimestamp: interaction.message.editedTimestamp
              ? new Date(interaction.message.editedTimestamp).toISOString()
              : undefined,
            mentions: interaction.message.mentions.users.map((u) => u.id),
          }
        : raise("Message not found")

    const member: GuildMemberInfo | undefined =
      interaction.member instanceof Discord.GuildMember
        ? {
            ...pick(pruneNullishValues(interaction.member), [
              "id",
              "nick",
              "displayName",
              "avatarUrl",
              "displayAvatarUrl",
              "color",
              "pending",
            ]),
            displayName: interaction.member.displayName,
            roles: [...interaction.member.roles.cache.map((role) => role.id)],
            joinedAt: interaction.member.joinedAt?.toISOString(),
            premiumSince: interaction.member.premiumSince?.toISOString(),
            communicationDisabledUntil:
              interaction.member.communicationDisabledUntil?.toISOString(),
          }
        : undefined

    const guild: GuildInfo | undefined = interaction.guild
      ? {
          ...pick(pruneNullishValues(interaction.guild), ["id", "name"]),
          member: member ?? raise("unexpected: member is undefined"),
        }
      : undefined

    const user: UserInfo = {
      ...pick(pruneNullishValues(interaction.user), [
        "id",
        "username",
        "discriminator",
        "tag",
      ]),
      avatarUrl: interaction.user.avatarURL()!,
      accentColor: interaction.user.accentColor ?? undefined,
    }

    const baseProps: Except<ComponentInteraction, "type"> = {
      id: interaction.id,
      customId: interaction.customId,
      update: async (options: MessageOptions) => {
        await interaction.update(getDiscordMessageOptions(options))
      },
      deferUpdate: async () => {
        if (interaction.replied || interaction.deferred) return
        await interaction.deferUpdate()
      },
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
      event: {
        channel,
        message,
        user,
        guild,

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
      }
    }

    if (interaction.isSelectMenu()) {
      return {
        ...baseProps,
        type: "select",
        event: {
          ...baseProps.event,
          values: interaction.values,
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
    disableComponents: async () => {
      for (const actionRow of message.components) {
        for (const component of actionRow.components) {
          component.setDisabled(true)
        }
      }

      await message.edit({
        components: message.components,
      })
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
    disableComponents: () => {
      console.warn("Ephemeral messages can't be edited")
      return Promise.resolve()
    },
    delete: () => {
      console.warn("Ephemeral messages can't be deleted")
      return Promise.resolve()
    },
  }
}

// TODO: this could be a part of the core library,
// and also handle some edge cases, e.g. empty messages
function getDiscordMessageOptions(
  reacordOptions: MessageOptions,
): Discord.MessageOptions {
  const options: Discord.MessageOptions = {
    // eslint-disable-next-line unicorn/no-null
    content: reacordOptions.content || null,
    embeds: reacordOptions.embeds,
    components: reacordOptions.actionRows.map((row) => ({
      type: "ACTION_ROW",
      components: row.map(
        (component): Discord.MessageActionRowComponentOptions => {
          if (component.type === "button") {
            return {
              type: "BUTTON",
              customId: component.customId,
              label: component.label ?? "",
              style: toUpper(component.style ?? "secondary"),
              disabled: component.disabled,
              emoji: component.emoji,
            }
          }

          if (component.type === "select") {
            return {
              ...component,
              type: "SELECT_MENU",
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
