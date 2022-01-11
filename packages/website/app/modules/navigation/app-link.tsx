import type { ComponentPropsWithoutRef } from "react"
import { Link } from "remix"

export type AppLinkProps = ComponentPropsWithoutRef<"a"> & {
  type: "internal" | "external" | "router"
  to: string
}

export function AppLink({ type, to, children, ...props }: AppLinkProps) {
  if (type === "internal") {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    )
  }

  if (type === "external") {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}
