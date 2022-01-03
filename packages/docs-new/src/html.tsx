import packageJson from "reacord/package.json"
import type { ReactNode } from "react"
import React from "react"

export function Html({
  title = "Reacord",
  description = packageJson.description,
  children,
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={description} />

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
        <link href="/tailwind.css" rel="stylesheet" />
        <link href="/prism-theme.css" rel="stylesheet" />

        <script type="module" src="/popover-menu.client.js" />

        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
