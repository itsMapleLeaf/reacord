// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import prefetch from "@astrojs/prefetch"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
		prefetch(),
	],
	markdown: {
		shikiConfig: {},
	},
})
