/* eslint-disable @typescript-eslint/no-var-requires */
const { default: react } = require("@vitejs/plugin-react-swc");
const { default: eslint } = require("vite-plugin-eslint");
const svgr = require("vite-plugin-svgr");
const tsconfig = require("./tsconfig.json");
const { convertPathToAlias } = require("./scripts/vite/internal");

/**
 *
 * @param {string} basePath
 * @return {import("vite").UserConfig}
 */
const getDefaultConfig = (basePath = __dirname) => ({
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
	resolve: {
		alias: convertPathToAlias(tsconfig.compilerOptions.paths, basePath),
	},
	plugins: [
		svgr(),
		react({
			tsDecorators: true,
		}),
		eslint({
			failOnWarning: true,
			fix: true,
			cache: false,
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
	},
});

module.exports = {
	getDefaultConfig,
	convertPathToAlias,
};
