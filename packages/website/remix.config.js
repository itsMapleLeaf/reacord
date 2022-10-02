/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  devServerPort: 8002,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildDirectory: "build",
  mdx: async () => {
    const rehypePrism = await import("rehype-prism-plus")
    return {
      rehypePlugins: [rehypePrism.default],
    }
  },
}
