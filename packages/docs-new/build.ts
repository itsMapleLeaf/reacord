import { resolve } from "node:path"
import { build } from "vite"

await build({
  build: { outDir: "dist/client" },
})

await build({
  build: {
    ssr: resolve("src/entry.server.tsx"),
    outDir: "dist/server",
    rollupOptions: {
      output: { format: "es" },
    },
  },
})
