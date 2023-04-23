const path = require("path");

/**
 * Convert typescripts "compilerOptions.paths" to vite/webpack alias
 * @param {Record<string, string[]>} paths
 * @param {string} basePath
 * @returns
 */
function convertPathToAlias(paths, basePath) {
	return Object.keys(paths)
		.filter((p) => p.endsWith("*"))
		.reduce((acc, key) => {
			const p = paths[key][0];
			acc[key.slice(0, key.length - 2)] = path.resolve(basePath, p.slice(0, p.length - 1));
			return acc;
		}, {});
}

module.exports = {
	convertPathToAlias,
};
