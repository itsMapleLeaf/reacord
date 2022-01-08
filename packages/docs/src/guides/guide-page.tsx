import clsx from "clsx"
import React from "react"
import { LocalFileAsset } from "../asset-builder/asset.js"
import { markdownTransformer } from "../asset-builder/markdown-transformer.js"
import { Html } from "../html.js"
import { AppLink } from "../navigation/app-link"
import { guideLinks } from "../navigation/guide-links"
import { MainNavigation } from "../navigation/main-navigation"
import { docsProseClass, linkClass, maxWidthContainer } from "../ui/components"

export function GuidePage({ url }: { url: string }) {
  return (
    <LocalFileAsset
      from={new URL(`${url}.md`, import.meta.url)}
      using={markdownTransformer}
    >
      {(asset) => (
        <Html title={asset.data.title} description={asset.data.description}>
          <Header />
          <Body content={asset.content} />
        </Html>
      )}
    </LocalFileAsset>
  )
}

function Header() {
  return (
    <header className="bg-slate-700/30 shadow sticky top-0 backdrop-blur-sm transition z-10 flex">
      <div className={maxWidthContainer}>
        <MainNavigation />
      </div>
    </header>
  )
}

function Body({ content }: { content: { __html: string } }) {
  return (
    <main className={clsx(maxWidthContainer, "mt-8 flex items-start gap-4")}>
      <nav className="w-48 sticky top-24 hidden md:block">
        <h2 className="text-2xl">Guides</h2>
        <ul className="mt-3 flex flex-col gap-2 items-start">
          {guideLinks.map((link) => (
            <li key={link.to}>
              <AppLink {...link} className={linkClass} />
            </li>
          ))}
        </ul>
      </nav>
      <section
        className={clsx(docsProseClass, "pb-8 flex-1 min-w-0")}
        dangerouslySetInnerHTML={content}
      />
    </main>
  )
}
