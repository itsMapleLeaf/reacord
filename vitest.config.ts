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
    reporters: ["verbose"],

    // rate limiting means these timeouts need to be long af
    hookTimeout: 60_000,
    testTimeout: 60_000,
  },
})
