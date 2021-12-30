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

  mdx: async (filename) => {
    const highlight = await import("rehype-prism-plus").then(
      (mod) => mod.default,
    )
    return {
      rehypePlugins: [highlight],
    }
  },
}
