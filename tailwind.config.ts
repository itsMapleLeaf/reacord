import typography from "@tailwindcss/typography"

export default {
	theme: {
		fontFamily: {
			sans: ["RubikVariable", "sans-serif"],
			monospace: ["'JetBrains Mono'", "monospace"],
		},
		boxShadow: {
			DEFAULT: "0 2px 9px 0 rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
		},
		extend: {},
	},
	corePlugins: {
		container: false,
	},
	plugins: [],
}
