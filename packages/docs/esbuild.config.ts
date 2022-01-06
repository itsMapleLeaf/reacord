import type { BuildOptions } from "esbuild"
import packageJson from "./package.json"

export const esbuildConfig: BuildOptions = {
  entryPoints: [packageJson.source],
  bundle: true,
  outfile: packageJson.main,
  format: "esm",
  target: "node16",
  platform: "node",
  external: Object.keys(packageJson.dependencies),
}
