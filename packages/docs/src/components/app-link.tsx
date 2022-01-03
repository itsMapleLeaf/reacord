import { ExternalLink } from "./external-link"

export type AppLinkProps = {
  type: "internal" | "external"
  label: React.ReactNode
  to: string
  className?: string
}

export function AppLink(props: AppLinkProps) {
  switch (props.type) {
    case "internal":
      return (
        <a className={props.className} href={props.to}>
          {props.label}
        </a>
      )

    case "external":
      return (
        <ExternalLink className={props.className} href={props.to}>
          {props.label}
        </ExternalLink>
      )
  }
}
