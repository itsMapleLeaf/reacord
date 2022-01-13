import type { ReactNode } from "react"
import type { PathPattern } from "react-router"
import { useMatch } from "react-router"

export function ActiveLink({
  to,
  children,
}: {
  to: string | PathPattern
  children: (props: { active: boolean }) => ReactNode
}) {
  const match = useMatch(to)
  return <>{children({ active: match != undefined })}</>
}
