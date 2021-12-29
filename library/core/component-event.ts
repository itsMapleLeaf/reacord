import type { ReactNode } from "react"
import type { ReacordInstance } from "./instance"

export type ComponentEvent = {
  // todo: add more info, like user, channel, member, guild, etc.
  reply(content?: ReactNode): ReacordInstance
  ephemeralReply(content?: ReactNode): ReacordInstance
}
