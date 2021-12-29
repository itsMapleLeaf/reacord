/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
}
