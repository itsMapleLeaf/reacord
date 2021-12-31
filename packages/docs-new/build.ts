import { resolve } from "node:path"
import { build } from "vite"

await build({
  build: {
    outDir: "dist/client",
    lib: {
      entry: resolve("src/entry.client.tsx"),
      fileName: () => "entry.client.js",
      formats: ["es"],
    },
  },
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
