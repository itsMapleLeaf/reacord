// @ts-expect-error
import rehypePrism from "@mapbox/rehype-prism"
import react from "@vitejs/plugin-react"
import remarkFrontmatter from "remark-frontmatter"
import { defineConfig } from "vite"
import ssr from "vite-plugin-ssr/plugin"
import xdm from "xdm/rollup.js"
import { preval } from "./plugins/preval"

export default defineConfig({
  build: {
    target: ["node16", "chrome89", "firefox89"],
  },
  plugins: [
    ssr(),
    react(),
    xdm({
      remarkPlugins: [remarkFrontmatter],
      rehypePlugins: [rehypePrism],
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
