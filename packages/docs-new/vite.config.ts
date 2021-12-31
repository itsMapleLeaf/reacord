import rehypePrism from "@mapbox/rehype-prism"
import react from "@vitejs/plugin-react"
import remarkFrontmatter from "remark-frontmatter"
import { defineConfig } from "vite"
import xdm from "xdm/rollup"

export default defineConfig({
  plugins: [
    react(),
    xdm({
      remarkPlugins: [remarkFrontmatter],
      rehypePlugins: [rehypePrism],
    }),
  ],
  resolve: {
    alias: {
      // https://github.com/brillout/vite-plugin-mdx/issues/44#issuecomment-974540152
      "react/jsx-runtime": "react/jsx-runtime.js",
    },
  },
})
