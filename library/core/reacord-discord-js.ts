import type * as Discord from "discord.js"
import { raise } from "../../helpers/raise"
import { toUpper } from "../../helpers/to-upper"
import type { ComponentInteraction } from "../internal/interaction"
import type { Message, MessageOptions } from "../internal/message"
import { ChannelMessageRenderer } from "../internal/renderers/channel-message-renderer"
import { CommandReplyRenderer } from "../internal/renderers/command-reply-renderer"
import type { ReacordConfig, ReacordInstance } from "./reacord"
import { Reacord } from "./reacord"

export class ReacordDiscordJs extends Reacord {
  constructor(private client: Discord.Client, config: ReacordConfig = {}) {
    super(config)

    client.on("interactionCreate", (interaction) => {
      if (interaction.isMessageComponent()) {
        this.handleComponentInteraction(
          createReacordComponentInteraction(interaction),
        )
      }
    })
  }

  override send(
    channelId: string,
    initialContent?: React.ReactNode,
  ): ReacordInstance {
    return this.createInstance(
      new ChannelMessageRenderer({
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
      }),
      initialContent,
    )
  }

  override reply(
    interaction: Discord.CommandInteraction,
    initialContent?: React.ReactNode,
  ): ReacordInstance {
    return this.createInstance(
      new CommandReplyRenderer({
        type: "command",
        id: interaction.id,
        channelId: interaction.channelId,
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
      }),
      initialContent,
    )
  }
}

function createReacordComponentInteraction(
  interaction: Discord.MessageComponentInteraction,
): ComponentInteraction {
  if (interaction.isButton()) {
    return {
      type: "button",
      id: interaction.id,
      channelId: interaction.channelId,
      customId: interaction.customId,
      update: async (options) => {
        await interaction.update(getDiscordMessageOptions(options))
      },
      deferUpdate: () => interaction.deferUpdate(),
    }
  }

  if (interaction.isSelectMenu()) {
    return {
      type: "select",
      id: interaction.id,
      channelId: interaction.channelId,
      customId: interaction.customId,
      values: interaction.values,
      update: async (options) => {
        await interaction.update(getDiscordMessageOptions(options))
      },
      deferUpdate: () => interaction.deferUpdate(),
    }
  }

  raise(`Unsupported component interaction type: ${interaction.type}`)
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
