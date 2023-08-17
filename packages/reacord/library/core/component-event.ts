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
	message: MessageInfo

	/**
	 * The channel that this event occurred in.
	 *
	 * @see https://discord.com/developers/docs/resources/channel#channel-object
	 */
	channel: ChannelInfo

	/**
	 * The user that triggered this event.
	 *
	 * @see https://discord.com/developers/docs/resources/user#user-object
	 */
	user: UserInfo

	/**
	 * The guild that this event occurred in.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object
	 */
	guild?: GuildInfo

	/** Create a new reply to this event. */
	reply(content?: ReactNode): ReacordInstance

	/**
	 * Create an ephemeral reply to this event, shown only to the user who
	 * triggered it.
	 */
	ephemeralReply(content?: ReactNode): ReacordInstance
}

/** @category Component Event */
export interface ChannelInfo {
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
export interface MessageInfo {
	id: string
	channelId: string
	authorId: string
	member?: GuildMemberInfo
	content: string
	timestamp: string
	editedTimestamp?: string
	tts: boolean
	mentionEveryone: boolean
	/** The IDs of mentioned users */
	mentions: string[]
}

/** @category Component Event */
export interface GuildInfo {
	id: string
	name: string
	member: GuildMemberInfo
}

/** @category Component Event */
export interface GuildMemberInfo {
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
export interface UserInfo {
	id: string
	username: string
	discriminator: string
	tag: string
	avatarUrl: string
	accentColor?: number
}
