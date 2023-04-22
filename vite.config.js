/* eslint-disable @typescript-eslint/no-var-requires */
const { default: react } = require("@vitejs/plugin-react-swc");
const { default: eslint } = require("vite-plugin-eslint");
const tsconfig = require("./tsconfig.json");
const { convertPathToAlias } = require("./scripts/vite/internal");

/**
 *
 * @param {string} basePath
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
		react({
			tsDecorators: true,
		}),
		eslint({
			failOnWarning: false,
		}),
	],
	build: {
		rollupOptions: {
			input: {
				app: "./public/index.html",
			},
		},
	},
});

module.exports = {
	getDefaultConfig,
	convertPathToAlias,
};
