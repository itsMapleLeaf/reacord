import type { ReactNode } from "react"
import type { ReacordInstance } from "./reacord-instance"

/**
 * @category Component Event
 */
export type ComponentEvent = {
  /**
   * Create a new reply to this event.
   */
  reply(content?: ReactNode): ReacordInstance

  /**
   * Create an ephemeral reply to this event,
   * shown only to the user who triggered it.
   */
  ephemeralReply(content?: ReactNode): ReacordInstance
}
