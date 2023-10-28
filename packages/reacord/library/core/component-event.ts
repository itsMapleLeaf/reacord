import type { ReactNode } from "react"
import type { ReacordInstance } from "./instance"

/** @category Component Event */
export interface ComponentEvent {
	/**
	 * The message associated with this event. For example: with a button click,
	 * this is the message that the button is on.
	 *
	 * @see https://discord.com/developers/docs/resources/channel#message-object
	 */
	message: ComponentEventMessage

	/**
	 * The channel that this event occurred in.
	 *
	 * @see https://discord.com/developers/docs/resources/channel#channel-object
	 */
	channel: ComponentEventChannel

	/**
	 * The user that triggered this event.
	 *
	 * @see https://discord.com/developers/docs/resources/user#user-object
	 */
	user: ComponentEventUser

	/**
	 * The guild that this event occurred in.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object
	 */
	guild?: ComponentEventGuild

	/** Create a new reply to this event. */
	reply(
		content?: ReactNode,
		options?: ComponentEventReplyOptions,
	): ReacordInstance

	/**
	 * Create an ephemeral reply to this event, shown only to the user who
	 * triggered it.
	 *
	 * @deprecated Use event.reply(content, { ephemeral: true })
	 */
	ephemeralReply(content?: ReactNode): ReacordInstance
}

/** @category Component Event */
export interface ComponentEventReplyOptions {
	ephemeral?: boolean
	tts?: boolean
}

/** @category Component Event */
export interface ComponentEventChannel {
	id: string
	name?: string
	topic?: string
	nsfw?: boolean
	lastMessageId?: string
	ownerId?: string
	parentId?: string
	rateLimitPerUser?: number
}

/** @category Component Event */
export interface ComponentEventMessage {
	id: string
	channelId: string
	authorId: string
	member?: ComponentEventGuildMember
	content: string
	timestamp: string
	editedTimestamp?: string
	tts: boolean
	mentionEveryone: boolean
	/** The IDs of mentioned users */
	mentions: string[]
}

/** @category Component Event */
export interface ComponentEventGuild {
	id: string
	name: string
	member: ComponentEventGuildMember
}

/** @category Component Event */
export interface ComponentEventGuildMember {
	id: string
	nick?: string
	displayName: string
	avatarUrl?: string
	displayAvatarUrl: string
	roles: string[]
	color: number
	joinedAt?: string
	premiumSince?: string
	pending?: boolean
	communicationDisabledUntil?: string
}

/** @category Component Event */
export interface ComponentEventUser {
	id: string
	username: string
	discriminator: string
	tag: string
	avatarUrl: string | null
	accentColor?: number
}
