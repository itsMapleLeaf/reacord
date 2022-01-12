import type { ComponentPropsWithoutRef } from "react"
import { Link } from "remix"
import { ExternalLink } from "~/modules/dom/external-link"

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
      <ExternalLink href={to} {...props}>
        {children}
      </ExternalLink>
    )
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}
