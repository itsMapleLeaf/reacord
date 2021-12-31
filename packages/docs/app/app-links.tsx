import {
  CodeIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid"
import type { AppLinkProps } from "~/components/app-link"
import { createContentIndex } from "~/helpers/create-index.server"
import { inlineIconClass } from "~/styles"

export const mainLinks: AppLinkProps[] = [
  {
    type: "router",
    to: "/docs/guides/getting-started",
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

export async function getGuideLinks(): Promise<AppLinkProps[]> {
  const entries = await createContentIndex("app/routes/docs/guides")
  return entries.map((entry) => ({
    type: "router",
    label: entry.title,
    to: entry.route,
  }))
}
