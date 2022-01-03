import { build } from "esbuild"
import { readFile } from "node:fs/promises"
import { dirname } from "node:path"
import React from "react"
import { guideLinks } from "../data/guide-links"
import { mainLinks } from "../data/main-links"
import { linkClass } from "../styles/components"
import type { AppLinkProps } from "./app-link"
import { AppLink } from "./app-link"
import { PopoverMenu } from "./popover-menu"
import { Script } from "./script"

const clientSourcePath = new URL(
  "./main-navigation.client.tsx",
  import.meta.url,
).pathname

const clientOutput = await build({
  bundle: true,
  stdin: {
    contents: await readFile(clientSourcePath, "utf-8"),
    sourcefile: clientSourcePath,
    loader: "tsx",
    resolveDir: dirname(clientSourcePath),
  },
  target: ["chrome89", "firefox89"],
  format: "esm",
  write: false,
})

export type MainNavigationClientData = {
  guideLinks: AppLinkProps[]
}

const data: MainNavigationClientData = { guideLinks }

export function MainNavigation() {
  return (
    <nav className="flex justify-between items-center h-16">
      <a href="/">
        <h1 className="text-3xl font-light">reacord</h1>
      </a>
      <div className="hidden md:flex gap-4">
        {mainLinks.map((link) => (
          <AppLink {...link} key={link.to} className={linkClass} />
        ))}
      </div>
      <div className="md:hidden" id="main-navigation-popover">
        <PopoverMenu>
          {mainLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
          <hr className="border-0 h-[2px] bg-black/50" />
          {data.guideLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
        </PopoverMenu>
      </div>
      <Script id="main-navigation-popover-data" type="application/json">
        {JSON.stringify(data)}
      </Script>
      <Script>{clientOutput.outputFiles[0]?.text!}</Script>
    </nav>
  )
}
