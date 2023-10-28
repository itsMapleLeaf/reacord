import { safeJsonStringify } from "@reacord/helpers/json"
import { pick } from "@reacord/helpers/pick"
import { pruneNullishValues } from "@reacord/helpers/prune-nullish-values"
import { raise } from "@reacord/helpers/raise"
import * as Discord from "discord.js"
import type { ReactNode } from "react"
import type { Except } from "type-fest"
import type { ComponentInteraction } from "../internal/interaction"
import type {
	Message,
	MessageButtonOptions,
	MessageOptions,
} from "../internal/message"
import { ChannelMessageRenderer } from "../internal/renderers/channel-message-renderer"
import { InteractionReplyRenderer } from "../internal/renderers/interaction-reply-renderer"
import type {
	ComponentEventChannel,
	ComponentEventGuild,
	ComponentEventGuildMember,
	ComponentEventMessage,
	ComponentEventReplyOptions,
	ComponentEventUser,
} from "./component-event"
import type { ReacordInstance } from "./instance"
import type { ReacordConfig } from "./reacord"
import { Reacord } from "./reacord"

/**
 * The Reacord adapter for Discord.js.
 *
 * @category Core
 */
export class ReacordDiscordJs extends Reacord {
	constructor(
		private client: Discord.Client,
		config: ReacordConfig = {},
	) {
		super(config)

		client.on("interactionCreate", (interaction) => {
			if (interaction.isButton() || interaction.isStringSelectMenu()) {
				this.handleComponentInteraction(
					this.createReacordComponentInteraction(interaction),
				)
			}
		})
	}

	/**
	 * Sends a message to a channel.
	 *
	 * @param target Discord channel object.
	 * @param [options] Options for the channel message
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 * @see {@link Discord.MessageCreateOptions}
	 */
	public createChannelMessage(
		target: Discord.ChannelResolvable,
		options: Discord.MessageCreateOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createChannelMessageRenderer(target, options),
		)
	}

	/**
	 * Replies to a command interaction by sending a message.
	 *
	 * @param interaction Discord command interaction object.
	 * @param [options] Custom options for the interaction reply method.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 * @see {@link Discord.InteractionReplyOptions}
	 */
	public createInteractionReply(
		interaction: Discord.CommandInteraction,
		options: Discord.InteractionReplyOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, options),
		)
	}

	/**
	 * Sends a message to a channel.
	 *
	 * @deprecated Use reacord.createChannelMessage() instead.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public send(
		channel: Discord.ChannelResolvable,
		initialContent?: React.ReactNode,
	): ReacordInstance {
		return this.createInstance(
			this.createChannelMessageRenderer(channel, {}),
			initialContent,
		)
	}

	/**
	 * Sends a message as a reply to a command interaction.
	 *
	 * @deprecated Use reacord.createInteractionReply() instead.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public reply(
		interaction: Discord.CommandInteraction,
		initialContent?: React.ReactNode,
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, {}),
			initialContent,
		)
	}

	/**
	 * Sends an ephemeral message as a reply to a command interaction.
	 *
	 * @deprecated Use reacord.createInteractionReply(interaction, { ephemeral:
	 *   true })
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public ephemeralReply(
		interaction: Discord.CommandInteraction,
		initialContent?: React.ReactNode,
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, {
				ephemeral: true,
			}),
			initialContent,
		)
	}

	private createChannelMessageRenderer(
		channelResolvable: Discord.ChannelResolvable,
		messageCreateOptions?: Discord.MessageCreateOptions,
	) {
		return new ChannelMessageRenderer({
			send: async (messageOptions) => {
				let channel = this.client.channels.resolve(channelResolvable)
				if (!channel && typeof channelResolvable === "string") {
					channel = await this.client.channels.fetch(channelResolvable)
				}

				if (!channel) {
					const id =
						typeof channelResolvable === "string"
							? channelResolvable
							: channelResolvable.id
					raise(`Channel ${id} not found`)
				}

				if (!channel.isTextBased()) {
					raise(`Channel ${channel.id} must be a text channel`)
				}

				const message = await channel.send({
					...getDiscordMessageOptions(messageOptions),
					...messageCreateOptions,
				})
				return createReacordMessage(message)
			},
		})
	}

	private createInteractionReplyRenderer(
		interaction:
			| Discord.CommandInteraction
			| Discord.MessageComponentInteraction,
		interactionReplyOptions: Discord.InteractionReplyOptions,
	) {
		return new InteractionReplyRenderer({
			interactionId: interaction.id,
			reply: async (messageOptions) => {
				const message = await interaction.reply({
					...getDiscordMessageOptions(messageOptions),
					...interactionReplyOptions,
					fetchReply: true,
				})
				return createReacordMessage(message)
			},
			followUp: async (messageOptions) => {
				const message = await interaction.followUp({
					...getDiscordMessageOptions(messageOptions),
					...interactionReplyOptions,
					fetchReply: true,
				})
				return createReacordMessage(message)
			},
		})
	}

	private createReacordComponentInteraction(
		interaction: Discord.MessageComponentInteraction,
	): ComponentInteraction {
		// todo please dear god clean this up
		const channel: ComponentEventChannel = interaction.channel
			? {
					...pruneNullishValues(
						pick(interaction.channel, [
							"topic",
							"nsfw",
							"lastMessageId",
							"ownerId",
							"parentId",
							"rateLimitPerUser",
						]),
					),
					id: interaction.channelId,
			  }
			: raise("Non-channel interactions are not supported")

		const message: ComponentEventMessage =
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
						authorId: interaction.message.author.id,
						mentionEveryone: interaction.message.mentions.everyone,
				  }
				: raise("Message not found")

		const member: ComponentEventGuildMember | undefined =
			interaction.member instanceof Discord.GuildMember
				? {
						...pruneNullishValues(
							pick(interaction.member, [
								"id",
								"nick",
								"displayName",
								"avatarUrl",
								"displayAvatarUrl",
								"color",
								"pending",
							]),
						),
						displayName: interaction.member.displayName,
						roles: interaction.member.roles.cache.map((role) => role.id),
						joinedAt: interaction.member.joinedAt?.toISOString(),
						premiumSince: interaction.member.premiumSince?.toISOString(),
						communicationDisabledUntil:
							interaction.member.communicationDisabledUntil?.toISOString(),
						color: interaction.member.displayColor,
						displayAvatarUrl: interaction.member.displayAvatarURL(),
				  }
				: undefined

		const guild: ComponentEventGuild | undefined = interaction.guild
			? {
					...pruneNullishValues(pick(interaction.guild, ["id", "name"])),
					member: member ?? raise("unexpected: member is undefined"),
			  }
			: undefined

		const user: ComponentEventUser = {
			...pruneNullishValues(
				pick(interaction.user, ["id", "username", "discriminator", "tag"]),
			),
			avatarUrl: interaction.user.avatarURL(),
			accentColor: interaction.user.accentColor ?? undefined,
		}

		const baseProps: Except<ComponentInteraction, "type"> = {
			id: interaction.id,
			customId: interaction.customId,
			update: async (options: MessageOptions) => {
				if (interaction.deferred || interaction.replied) {
					await interaction.message.edit(getDiscordMessageOptions(options))
				} else {
					await interaction.update(getDiscordMessageOptions(options))
				}
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
				return createReacordMessage(message)
			},
			followUp: async (options) => {
				const message = await interaction.followUp({
					...getDiscordMessageOptions(options),
					fetchReply: true,
				})
				return createReacordMessage(message)
			},
			event: {
				channel,
				message,
				user,
				guild,

				reply: (content?: ReactNode, options?: ComponentEventReplyOptions) =>
					this.createInstance(
						this.createInteractionReplyRenderer(interaction, options ?? {}),
						content,
					),

				/** @deprecated Use event.reply(content, { ephemeral: true }) */
				ephemeralReply: (content: ReactNode) =>
					this.createInstance(
						this.createInteractionReplyRenderer(interaction, {
							ephemeral: true,
						}),
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

		if (interaction.isStringSelectMenu()) {
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
		delete: async () => {
			await message.delete()
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
		content: reacordOptions.content || undefined,
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

					if (component.type === "link") {
						return {
							type: Discord.ComponentType.Button,
							url: component.url,
							label: component.label ?? "",
							style: Discord.ButtonStyle.Link,
							disabled: component.disabled,
							emoji: component.emoji,
						}
					}

					// future proofing
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

					component satisfies never
					throw new Error(
						`Invalid component type ${safeJsonStringify(component)}}`,
					)
				},
			),
		})),
	}

	if (!options.content && !options.embeds.length) {
		options.content = "_ _"
	}

	return options
}
