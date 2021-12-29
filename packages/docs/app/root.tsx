import clsx from "clsx"
import { useEffect, useState } from "react"
import type { LinksFunction, MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"

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
        <Header />
        <div className="m-auto max-w-screen-xl mt-8">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function Header() {
  const isScrolled = useScrolled()
  return (
    <header
      className={clsx(
        isScrolled ? "bg-slate-700/30" : "bg-slate-800",
        "shadow-md sticky top-0 px-4 py-3 backdrop-blur-sm transition",
      )}
    >
      <div className="m-auto max-w-screen-xl">
        <h1 className="text-3xl font-light">reacord</h1>
      </div>
    </header>
  )
}

function useScrolled() {
  const [isScrolled, setScrolled] = useState(
    typeof window !== "undefined" && window.scrollY > 0,
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return isScrolled
}
