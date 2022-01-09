import { createContext, useContext } from "react"
import type { GuideLink } from "~/modules/navigation/load-guide-links.server"

const Context = createContext<GuideLink[]>([])

export const GuideLinksProvider = Context.Provider

export function useGuideLinksContext() {
  return useContext(Context)
}
