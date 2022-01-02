import { Link } from "react-router-dom"
import { ExternalLink } from "./external-link"

export type AppLinkProps = {
  type: "router" | "internal" | "external"
  label: React.ReactNode
  to: string
  className?: string
}

export function AppLink(props: AppLinkProps) {
  switch (props.type) {
    case "router":
      return (
        <Link className={props.className} to={props.to}>
          {props.label}
        </Link>
      )

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
