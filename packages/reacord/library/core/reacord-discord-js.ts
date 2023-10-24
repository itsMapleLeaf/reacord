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
	ChannelInfo,
	GuildInfo,
	GuildMemberInfo,
	MessageInfo,
	ReplyInfo,
	UserInfo,
} from "./component-event"
import type { ReacordInstance } from "./instance"
import type { ReacordConfig } from "./reacord"
import { Reacord } from "./reacord"

/**
 * Options for the channel message.
 *
 * @see https://reacord.mapleleaf.dev/guides/sending-messages
 */
export interface LegacyCreateChannelMessageOptions
	extends CreateChannelMessageOptions {
	/**
	 * Send message as a reply. Requires the use of message event instead of
	 * channel id provided as argument.
	 *
	 * @deprecated Use reacord.createMessageReply()
	 */
	reply?: boolean
}

/**
 * Options for the channel message.
 *
 * @see https://reacord.mapleleaf.dev/guides/sending-messages
 */
export interface CreateChannelMessageOptions {}

/**
 * Options for the message reply method.
 *
 * @see https://reacord.mapleleaf.dev/guides/sending-messages
 */
export interface CreateMessageReplyOptions {}

/**
 * Custom options for the interaction reply method.
 *
 * @see https://reacord.mapleleaf.dev/guides/sending-messages
 */
export type CreateInteractionReplyOptions = ReplyInfo

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
	 * @param target - Discord channel object.
	 * @param [options] - Options for the channel message
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public createChannelMessage(
		target: Discord.Channel,
		options: CreateChannelMessageOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createChannelMessageRenderer(target, options),
		)
	}

	/**
	 * Replies to a message by sending a message.
	 *
	 * @param message - Discord message event object.
	 * @param [options] - Options for the message reply method.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public createMessageReply(
		message: Discord.Message,
		options: CreateMessageReplyOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createMessageReplyRenderer(message, options),
		)
	}

	/**
	 * Replies to a command interaction by sending a message.
	 *
	 * @param interaction - Discord command interaction object.
	 * @param [options] - Custom options for the interaction reply method.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public createInteractionReply(
		interaction: Discord.CommandInteraction,
		options: CreateInteractionReplyOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, options),
		)
	}

	/**
	 * Sends a message to a channel. Alternatively replies to message event.
	 *
	 * @deprecated Use reacord.createChannelMessage() or
	 *   reacord.createMessageReply() instead.
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public send(
		event: string | Discord.Message,
		initialContent?: React.ReactNode,
		options: LegacyCreateChannelMessageOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createMessageReplyRenderer(event, options),
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
		options: CreateInteractionReplyOptions = {},
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, options),
			initialContent,
		)
	}

	/**
	 * Sends an ephemeral message as a reply to a command interaction.
	 *
	 * @deprecated Use reacord.createInteractionReply(interaction, content, {
	 *   ephemeral: true })
	 * @see https://reacord.mapleleaf.dev/guides/sending-messages
	 */
	public ephemeralReply(
		interaction: Discord.CommandInteraction,
		initialContent?: React.ReactNode,
		options?: Omit<CreateInteractionReplyOptions, "ephemeral">,
	): ReacordInstance {
		return this.createInstance(
			this.createInteractionReplyRenderer(interaction, {
				...options,
				ephemeral: true,
			}),
			initialContent,
		)
	}

	private createChannelMessageRenderer(
		channel: Discord.Channel,
		_opts?: CreateMessageReplyOptions,
	) {
		return new ChannelMessageRenderer({
			send: async (options) => {
				if (!channel.isTextBased()) {
					raise(`Channel ${channel.id} is not a text channel`)
				}

				const message = await channel.send(getDiscordMessageOptions(options))
				return createReacordMessage(message)
			},
		})
	}

	private createMessageReplyRenderer(
		event: string | Discord.Message,
		opts: CreateChannelMessageOptions | LegacyCreateChannelMessageOptions,
	) {
		return new ChannelMessageRenderer({
			send: async (options) => {
				// Backwards compatible channelId api
				// `event` is treated as MessageEvent depending on its type
				const channel =
					typeof event === "string"
						? this.client.channels.cache.get(event) ??
						  (await this.client.channels.fetch(event)) ??
						  raise(`Channel ${event} not found`)
						: event.channel

				if (!channel.isTextBased()) {
					raise(`Channel ${channel.id} is not a text channel`)
				}

				if ("reply" in opts && opts.reply) {
					if (typeof event === "string") {
						raise("Cannot send reply with channel ID provided")
					}

					const message = await event.reply(getDiscordMessageOptions(options))
					return createReacordMessage(message)
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
		opts: CreateInteractionReplyOptions,
	) {
		return new InteractionReplyRenderer({
			type: "command",
			id: interaction.id,
			reply: async (options) => {
				const message = await interaction.reply({
					...getDiscordMessageOptions(options),
					...opts,
					fetchReply: true,
				})
				return createReacordMessage(message)
			},
			followUp: async (options) => {
				const message = await interaction.followUp({
					...getDiscordMessageOptions(options),
					...opts,
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
		const channel: ChannelInfo = interaction.channel
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
						authorId: interaction.message.author.id,
						mentionEveryone: interaction.message.mentions.everyone,
				  }
				: raise("Message not found")

		const member: GuildMemberInfo | undefined =
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

		const guild: GuildInfo | undefined = interaction.guild
			? {
					...pruneNullishValues(pick(interaction.guild, ["id", "name"])),
					member: member ?? raise("unexpected: member is undefined"),
			  }
			: undefined

		const user: UserInfo = {
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

				reply: (content?: ReactNode, options?: ReplyInfo) =>
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
