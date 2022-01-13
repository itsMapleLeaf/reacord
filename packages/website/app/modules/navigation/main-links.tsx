import {
  CodeIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid"
import type { AppLinkProps } from "~/modules/navigation/app-link"
import { inlineIconClass } from "../ui/components"

export const mainLinks: AppLinkProps[] = [
  {
    type: "internal",
    to: "/guides/getting-started",
    children: (
      <>
        <DocumentTextIcon className={inlineIconClass} /> Guides
      </>
    ),
  },
  {
    type: "internal",
    to: "/api/",
    children: (
      <>
        <CodeIcon className={inlineIconClass} /> API Reference
      </>
    ),
  },
  {
    type: "external",
    to: "https://github.com/itsMapleLeaf/reacord",
    children: (
      <>
        <ExternalLinkIcon className={inlineIconClass} /> GitHub
      </>
    ),
  },
]
