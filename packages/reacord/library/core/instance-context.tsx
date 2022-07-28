import { raise } from "@reacord/helpers/raise"
import * as React from "react"
import type { ReacordInstance } from "./instance"

const Context = React.createContext<ReacordInstance | undefined>(undefined)

export const InstanceProvider = Context.Provider

/**
 * Get the associated instance for the current component.
 *
 * @category Core
 * @see https://reacord.mapleleaf.dev/guides/use-instance
 */
export function useInstance(): ReacordInstance {
  return (
    React.useContext(Context) ??
    raise("Could not find instance, was this component rendered via Reacord?")
  )
}
