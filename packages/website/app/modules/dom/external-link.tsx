import type { ComponentPropsWithoutRef } from "react"

export function ExternalLink({
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}
