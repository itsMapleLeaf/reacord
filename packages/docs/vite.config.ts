import react from "@vitejs/plugin-react"
import MarkdownIt from "markdown-it"
import prism from "markdown-it-prism"
import { createRequire } from "node:module"
import { defineConfig } from "vite"
import type * as markdownType from "vite-plugin-markdown"
import ssr from "vite-plugin-ssr/plugin"
import { preval } from "./plugins/preval"

const require = createRequire(import.meta.url)
const markdown: typeof markdownType = require("vite-plugin-markdown")

export default defineConfig({
  build: {
    target: ["node16", "chrome89", "firefox89"],
  },
  plugins: [
    ssr(),
    react(),
    markdown.default({
      mode: [markdown.Mode.HTML],
      markdownIt: new MarkdownIt({
        html: true,
        linkify: true,
      }).use(prism),
    }),
    preval(),
  ],
  resolve: {
    alias: {
      // https://github.com/brillout/vite-plugin-mdx/issues/44#issuecomment-974540152
      "react/jsx-runtime": "react/jsx-runtime.js",
    },
  },
})
