import packageJson from "reacord/package.json"
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "remix"
import { GuideLinksProvider } from "~/modules/navigation/guide-links-context"
import type { GuideLink } from "~/modules/navigation/load-guide-links.server"
import { loadGuideLinks } from "~/modules/navigation/load-guide-links.server"
import prismThemeCss from "~/modules/ui/prism-theme.css"
import tailwindCss from "~/modules/ui/tailwind.out.css"

export const meta: MetaFunction = () => ({
  title: "Reacord",
  description: packageJson.description,
})

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap",
  },
  { rel: "stylesheet", href: tailwindCss },
  { rel: "stylesheet", href: prismThemeCss },
]

type LoaderData = {
  guideLinks: GuideLink[]
}

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    guideLinks: await loadGuideLinks(),
  }
  return data
}

export default function App() {
  const data: LoaderData = useLoaderData()
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <script defer src="https://unpkg.com/alpinejs@3.7.1/dist/cdn.min.js" />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            defer
            data-website-id="49c69ade-5593-4853-9686-c9ca9d519a18"
            src="https://maple-umami.fly.dev/umami.js"
          />
        )}
      </head>
      <body>
        <GuideLinksProvider value={data.guideLinks}>
          <Outlet />
        </GuideLinksProvider>
        <ScrollRestoration />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
