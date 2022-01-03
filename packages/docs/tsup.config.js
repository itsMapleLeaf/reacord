import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/main.tsx"],
  target: "node16",
  format: ["esm"],
  sourcemap: true,
})
