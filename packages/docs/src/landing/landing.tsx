import packageJson from "reacord/package.json"
import React from "react"
import { LocalFileAsset } from "../asset-builder/asset.js"
import { markdownTransformer } from "../asset-builder/markdown-transformer.js"
import { Html } from "../html.js"
import { MainNavigation } from "../navigation/main-navigation"
import { maxWidthContainer } from "../ui/components"

export function Landing() {
  return (
    <Html>
      <div className="flex flex-col min-w-0 min-h-screen text-center">
        <header className={maxWidthContainer}>
          <MainNavigation />
        </header>
        <div className="px-4 pb-8 flex flex-1">
          <main className="px-4 py-6 rounded-lg shadow bg-slate-800 space-y-5 m-auto w-full max-w-xl">
            <h1 className="text-6xl font-light">reacord</h1>
            <LocalFileAsset
              from={new URL("landing-example.md", import.meta.url)}
              using={markdownTransformer}
            >
              {(asset) => (
                <section
                  className="mx-auto text-sm sm:text-base"
                  dangerouslySetInnerHTML={asset.content}
                />
              )}
            </LocalFileAsset>
            <p className="text-2xl font-light">{packageJson.description}</p>
            <a
              href="/guides/getting-started"
              className="inline-block px-4 py-3 text-xl transition rounded-lg bg-emerald-700 hover:translate-y-[-2px] hover:bg-emerald-800 hover:shadow"
            >
              Get Started
            </a>
          </main>
        </div>
      </div>
    </Html>
  )
}
