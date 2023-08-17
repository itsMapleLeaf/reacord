import { Config } from "tailwindcss"
import config from "../../tailwind.config.ts"

export default {
	...config,
	content: ["./src/**/*.{ts,tsx,md,astro}"],
} satisfies Config
