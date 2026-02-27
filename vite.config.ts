import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		solid({
			babel: {
				plugins: [["@babel/plugin-proposal-decorators", { version: "2023-11" }]],
			},
		}),
	],
})
