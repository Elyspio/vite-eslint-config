import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

import * as path from "path";
import tsconfig from "./tsconfig.json";

export function convertPathToAlias(paths: Record<string, string[]>, basePath: string) {
	return Object.keys(paths)
		.filter(p => p.endsWith("*"))
		.reduce((acc, key: string) => {
			const p = paths[key][0];
			acc[key.slice(0, key.length - 2)] = path.resolve(basePath, p.slice(0, p.length - 1));
			return acc;
		}, {} as Record<string, string>);
}

export const getDefaultConfig = (basePath: string = __dirname) =>
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
