import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
// @ts-ignore
import tsconfig from "../tsconfig.json";
import { UserConfig } from "vite";
import { convertPathToAlias } from "./internal.vite";
import vitePluginImport from "vite-plugin-babel-import";

export const getDefaultConfig = (basePath: string = __dirname): UserConfig => ({
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// if (id.includes("node_modules/@mui")) return "mui.vendor";
					// if (id.includes("node_modules/react/" || "node_modules/react-dom/")) return "react.vendor";
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
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
		vitePluginImport([
			{
				ignoreStyles: [],
				libraryName: "@mui/icons-material",
				libraryDirectory: "esm",
				libraryChangeCase: "pascalCase"
			},
			{
				ignoreStyles: [],
				libraryName: "@mui/material",
				libraryDirectory: "esm",
				libraryChangeCase: "pascalCase"
			},

		]),
	],
	resolve: {
		alias: convertPathToAlias(tsconfig.compilerOptions.paths, basePath),
	},
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
});

export * from "./internal.vite";
