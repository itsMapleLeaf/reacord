import type { ReactNode } from "react"
import type { ReacordInstance } from "./instance"

/**
 * @category Component Event
 */
export type ComponentEvent = {
  message: MessageInfo
  channel: ChannelInfo
  user: UserInfo
  guild?: GuildInfo
  reply(content?: ReactNode): ReacordInstance
  ephemeralReply(content?: ReactNode): ReacordInstance
}

/**
 * @category Component Event
 */
export type ChannelInfo = {
  id: string
  name?: string
  topic?: string
  nsfw?: boolean
  lastMessageId?: string
  ownerId?: string
  parentId?: string
  rateLimitPerUser?: number
}

/**
 * @category Component Event
 */
export type MessageInfo = {
  id: string
  channelId: string
  authorId: UserInfo
  member?: GuildMemberInfo
  content: string
  timestamp: string
  editedTimestamp?: string
  tts: boolean
  mentionEveryone: boolean
  /** The IDs of mentioned users */
  mentions: string[]
}

/**
 * @category Component Event
 */
export type GuildInfo = {
  id: string
  name: string
  member: GuildMemberInfo
}

/**
 * @category Component Event
 */
export type GuildMemberInfo = {
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

/**
 * @category Component Event
 */
export type UserInfo = {
  id: string
  username: string
  discriminator: string
  tag: string
  avatarUrl: string
  accentColor?: number
}
