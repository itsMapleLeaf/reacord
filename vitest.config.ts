/// <reference types="vitest" />
import { defineConfig } from "vitest/config"

export default defineConfig({
  build: {
    sourcemap: true,
  },
  test: {
    globalSetup: ["packages/reacord/test/global-setup.ts"],
    threads: false,
    isolate: false,
    hookTimeout: 20_000,
    testTimeout: 20_000,
    reporters: ["verbose"],
  },
})
