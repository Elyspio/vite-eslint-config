import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
// @ts-ignore
import tsconfig from "../tsconfig.json";
import { UserConfig } from "vite";
import { convertPathToAlias } from "./internal.vite";

export const getDefaultConfig = (basePath: string = __dirname): UserConfig => ({
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
					if (id.includes("node_modules/@mui")) return "mui.vendor";
					if (id.includes("node_modules/react/")) return "react.vendor";
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
	},
});

export * from "./internal.vite";
