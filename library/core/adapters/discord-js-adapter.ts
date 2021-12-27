import type * as Discord from "discord.js"
import { raise } from "../../../helpers/raise"
import { toUpper } from "../../../helpers/to-upper"
import type {
  CommandInteraction,
  ComponentInteraction,
} from "../../internal/interaction"
import type { Message, MessageOptions } from "../../internal/message"
import type { Adapter } from "./adapter"

export class DiscordJsAdapter implements Adapter<Discord.CommandInteraction> {
  constructor(private client: Discord.Client) {}

  /**
   * @internal
   */
  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ) {
    this.client.on("interactionCreate", (interaction) => {
      if (interaction.isMessageComponent()) {
        listener(createReacordComponentInteraction(interaction))
      }
    })
  }

  /**
   * @internal
   */
  // eslint-disable-next-line class-methods-use-this
  createCommandInteraction(
    interaction: Discord.CommandInteraction,
  ): CommandInteraction {
    return {
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
    }
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
    }
  }

  raise(`Unsupported component interaction type: ${interaction.type}`)
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
  }
}

function getDiscordMessageOptions(
  options: MessageOptions,
): Discord.MessageOptions {
  return {
    content: options.content,
    embeds: options.embeds,
    components: options.actionRows.map((row) => ({
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
}