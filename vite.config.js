/* eslint-disable @typescript-eslint/no-var-requires */

const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc");
const eslint = require("vite-plugin-eslint");

const path = require("path");
const tsconfig = require("./tsconfig.json");

/**
 * Convert typescripts "compilerOptions.paths" to vite/webpack alias
 * @param {Record<string, string[]>} paths
 * @param {string} basePath
 * @returns
 */
function convertPathToAlias(paths, basePath) {
	return Object.keys(paths)
		.filter(p => p.endsWith("*"))
		.reduce((acc, key) => {
			const p = paths[key][0];
			acc[key.slice(0, key.length - 2)] = path.resolve(basePath, p.slice(0, p.length - 1));
			return acc;
		}, {});
}

/**
 *
 * @param {string} basePath
 */
const getDefaultConfig = (basePath = __dirname) =>
	defineConfig({
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
	});

module.exports = {
	getDefaultConfig,
	convertPathToAlias,
};
