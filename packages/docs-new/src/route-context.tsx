import { createContext, useContext } from "react"

export type RouteContextValue = {
  routeParams: Record<string, string>
}

const Context = createContext<RouteContextValue>()

export const RouteContextProvider = Context.Provider

export function useRouteParams() {
  return useContext(Context)?.routeParams ?? {}
}
