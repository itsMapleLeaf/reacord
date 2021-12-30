/* eslint-disable unicorn/prefer-module */
const glob = require("fast-glob")
const { join, relative, normalize, parse } = require("path/posix")

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
  serverModuleFormat: "esm",

  routes: async (defineRoutes) => {
    const contentFolder = join(__dirname, "content")

    const contentFiles = await glob("**/*.{md,mdx}", {
      cwd: contentFolder,
      absolute: true,
    })

    return defineRoutes((route) => {
      route("docs", "docs.tsx", () => {
        for (const filePath of contentFiles) {
          const localFilePath = relative(contentFolder, filePath)
          const { dir, name } = parse(localFilePath)
          const routePath = join(dir, name)
          route(routePath, filePath, { index: true })
        }
      })
    })
  },

  mdx: async (filename) => {
    const highlight = await import("rehype-prism-plus").then(
      (mod) => mod.default,
    )
    return {
      rehypePlugins: [highlight],
    }
  },
}
