import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import packageJson from "reacord/package.json"
import bannerUrl from "~/assets/banner.png"
import faviconUrl from "~/assets/favicon.png"
import { GuideLinksProvider } from "~/modules/navigation/guide-links-context"
import { loadGuideLinks } from "~/modules/navigation/load-guide-links.server"
import prismThemeCss from "~/modules/ui/prism-theme.css"
import tailwindCss from "~/modules/ui/tailwind.out.css"

export const meta: MetaFunction = () => ({
  "title": "Reacord",
  "description": packageJson.description,
  "theme-color": "#21754b",

  "og:url": "https://reacord.mapleleaf.dev/",
  "og:type": "website",
  "og:title": "Reacord",
  "og:description": "Create interactive Discord messages using React",
  "og:image": bannerUrl,

  "twitter:card": "summary_large_image",
  "twitter:domain": "reacord.mapleleaf.dev",
  "twitter:url": "https://reacord.mapleleaf.dev/",
  "twitter:title": "Reacord",
  "twitter:description": "Create interactive Discord messages using React",
  "twitter:image": bannerUrl,
})

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/png", href: faviconUrl },
  { rel: "stylesheet", href: tailwindCss },
  { rel: "stylesheet", href: prismThemeCss },
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
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap",
  },
]

export async function loader() {
  return {
    guideLinks: await loadGuideLinks(),
  }
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        {/* eslint-disable-next-line unicorn/text-encoding-identifier-case */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            defer
            data-website-id="e3ce3a50-720e-4489-be37-cc091c1b7029"
            src="https://umami-production-72bc.up.railway.app/umami.js"
          ></script>
        )}
      </head>
      <body>
        <GuideLinksProvider value={data.guideLinks}>
          <Outlet />
        </GuideLinksProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
