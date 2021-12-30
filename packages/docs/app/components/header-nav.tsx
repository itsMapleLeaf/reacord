import { CodeIcon } from "@heroicons/react/outline"
import { DocumentTextIcon, ExternalLinkIcon } from "@heroicons/react/solid"
import { Link } from "remix"
import { ExternalLink } from "~/components/external-link"
import { linkClass } from "~/styles"

export function HeaderNav() {
  return (
    <nav className="flex justify-between items-center">
      <Link to="/">
        <h1 className="text-3xl font-light">reacord</h1>
      </Link>
      <div className="flex gap-4">
        <Link className={linkClass} to="/docs/guides/getting-started">
          <DocumentTextIcon className="inline align-sub w-5" /> Guides
        </Link>
        <a className={linkClass} href="/docs/api">
          <CodeIcon className="inline align-sub w-5" /> API Reference
        </a>
        <ExternalLink
          className={linkClass}
          href="https://github.com/itsMapleLeaf/reacord"
        >
          <ExternalLinkIcon className="inline align-sub w-5" /> GitHub
        </ExternalLink>
      </div>
    </nav>
  )
}
