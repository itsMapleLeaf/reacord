import {
  CodeIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid"
import type { AppLinkProps } from "../components/app-link"
import { inlineIconClass } from "../styles/components"

export const mainLinks: AppLinkProps[] = [
  {
    type: "router",
    to: "/docs/getting-started",
    label: (
      <>
        <DocumentTextIcon className={inlineIconClass} /> Guides
      </>
    ),
  },
  {
    type: "internal",
    to: "/docs/api",
    label: (
      <>
        <CodeIcon className={inlineIconClass} /> API Reference
      </>
    ),
  },
  {
    type: "external",
    to: "https://github.com/itsMapleLeaf/reacord",
    label: (
      <>
        <ExternalLinkIcon className={inlineIconClass} /> GitHub
      </>
    ),
  },
]
