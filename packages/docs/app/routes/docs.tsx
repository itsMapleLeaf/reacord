import { CodeIcon } from "@heroicons/react/outline"
import {
  DatabaseIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid"
import type { LoaderFunction } from "remix"
import { Link, Outlet, useLoaderData } from "remix"
import { ExternalLink } from "~/components/external-link"
import { HeaderLayout } from "~/components/header-layout"
import { SideNav } from "~/components/side-nav"
import { SidebarLayout } from "~/components/sidebar-layout"
import type { ContentIndexEntry } from "~/create-index.server"
import { createContentIndex } from "~/create-index.server"
import { linkClass } from "~/styles"

type LoaderData = ContentIndexEntry[]

export const loader: LoaderFunction = async () => {
  const data: LoaderData = await createContentIndex("app/routes/docs/guides")
  return data
}

export default function Docs() {
  const data: LoaderData = useLoaderData()
  return (
    <HeaderLayout
      header={<HeaderNav />}
      body={
        <SidebarLayout
          sidebar={
            <SideNav heading="Guides">
              {data.map(({ title, route }) => (
                <Link className={linkClass} key={route} to={route}>
                  {title}
                </Link>
              ))}
            </SideNav>
          }
          body={
            <section className="prose max-w-none prose-invert prose-h1:font-light flex-1 prose-h1:mb-4 prose-p:my-4 prose-pre:text-[15px] prose-pre:font-monospace prose-h2:font-light h-[200vh]">
              <Outlet />
            </section>
          }
        />
      }
    />
  )
}

function HeaderNav() {
  return (
    <nav className="flex justify-between items-center">
      <Link to="/">
        <h1 className="text-3xl font-light">
          reacord <CodeIcon className="inline w-8 align-sub opacity-50" />
        </h1>
      </Link>
      <div className="flex gap-4">
        <Link className={linkClass} to="/docs/guides/getting-started">
          <DocumentTextIcon className="inline align-sub w-5" /> Guides
        </Link>
        <Link className={linkClass} to="/docs/api">
          <DatabaseIcon className="inline align-sub w-5" /> API Reference
        </Link>
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
