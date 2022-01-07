import {
  CodeIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid/esm"
import React from "react"
import { inlineIconClass } from "../ui/components"
import type { AppLinkProps } from "./app-link"

export const mainLinks: AppLinkProps[] = [
  {
    type: "internal",
    to: "/guides/getting-started",
    label: (
      <>
        <DocumentTextIcon className={inlineIconClass} /> Guides
      </>
    ),
  },
  {
    type: "internal",
    to: "/guides/api",
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
