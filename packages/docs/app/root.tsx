import type { LinksFunction, MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import { Header } from "~/components/header"

export const meta: MetaFunction = () => {
  return { title: "New Remix App" }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/tailwind.css" },
]

export default function App() {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header>
          <div className="m-auto max-w-screen-xl px-4">
            <h1 className="text-3xl font-light">reacord</h1>
          </div>
        </Header>
        <div className="m-auto max-w-screen-xl px-4 mt-8">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
