import { createContext, useContext } from "react"

export type RouteContextValue = {
  routeParams: Record<string, string>
  pageData?: Record<string, unknown>
}

const Context = createContext<RouteContextValue>()

export const RouteContextProvider = Context.Provider

export function useRouteParams() {
  return useContext(Context)?.routeParams ?? {}
}

export function usePageData<T>() {
  return useContext(Context)?.pageData as T
}
