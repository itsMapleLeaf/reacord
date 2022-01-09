import packageJson from "reacord/package.json"
import type { ReactNode } from "react"
import React from "react"
import { LocalFileAsset, ModuleAsset } from "./asset-builder/asset.js"
import { scriptTransformer } from "./asset-builder/script-transformer.js"
import { stylesheetTransformer } from "./asset-builder/stylesheet-transformer.js"

export function Html({
  title: titleProp,
  description = packageJson.description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  const title = [titleProp, "Reacord"].filter(Boolean).join(" | ")
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
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
        />

        <ModuleAsset
          from="tailwindcss/tailwind.css"
          using={stylesheetTransformer}
        >
          {(asset) => <link rel="stylesheet" href={asset.url} />}
        </ModuleAsset>

        <LocalFileAsset
          from={new URL("ui/prism-theme.css", import.meta.url)}
          using={stylesheetTransformer}
        >
          {(asset) => <link rel="stylesheet" href={asset.url} />}
        </LocalFileAsset>
        <LocalFileAsset
          from={new URL("ui/markdown.css", import.meta.url)}
          using={stylesheetTransformer}
        >
          {(asset) => <link rel="stylesheet" href={asset.url} />}
        </LocalFileAsset>

        <title>{title}</title>

        <ModuleAsset
          from="alpinejs/dist/cdn.js"
          as="alpine"
          using={scriptTransformer}
        >
          {(asset) => <script defer src={asset.url} />}
        </ModuleAsset>
      </head>
      <body>{children}</body>
    </html>
  )
}
