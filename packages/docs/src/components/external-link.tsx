import type { ComponentPropsWithoutRef } from "react"

export function ExternalLink(props: ComponentPropsWithoutRef<"a">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  )
}
