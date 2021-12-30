import { CodeIcon } from "@heroicons/react/outline"
import {
  DatabaseIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid"
import type { LinksFunction, MetaFunction } from "remix"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import { ExternalLink } from "~/components/external-link"
import { HeaderLayout } from "~/components/header-layout"
import { linkClass } from "~/styles"
import prismThemeCss from "./prism-theme.css"

export const meta: MetaFunction = () => {
  return { title: "New Remix App" }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: prismThemeCss },
  { rel: "stylesheet", href: "/tailwind.css" },
]

export default function App() {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <HeaderLayout header={<HeaderNav />} body={<Outlet />} />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
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
