import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import tsconfig from "../tsconfig.json";
import {PluginOption, UserConfig} from "vite";
import { convertPathToAlias } from "./internal.vite";
import vitePluginImport from "vite-plugin-babel-import";
import viteChecker from "vite-plugin-checker";
import { PluginOptions } from "vite-plugin-babel-import";


type GetConfigParams = {
	basePath?: string,
	disableChunks?: boolean,
	preserveImports?: ("@mui/icons-material" | "@mui/material")[],
	port?: number,
	checker?: boolean
}


export const getDefaultConfig = ({ basePath, preserveImports, disableChunks, port = 3000, checker = true }: GetConfigParams): UserConfig => {

	basePath ??= __dirname;
	preserveImports ??= [];
	disableChunks ??= false


	const plugins = [
		svgr(),
		react({
			tsDecorators: true,
		}),
		eslint({
			failOnWarning: false,
			fix: true,
			cache: false,
		}),
		(checker ?  viteChecker({
			// e.g. use TypeScript check
			typescript: true,

		}) : false)
		,
	] as PluginOption[];

	if (preserveImports.length < 2) {
		plugins.push(vitePluginImport([
			!preserveImports.includes("@mui/icons-material") ? {
				ignoreStyles: [],
				libraryName: "@mui/icons-material",
				libraryDirectory: "",
				libraryChangeCase: "pascalCase"
			} : false,
			!preserveImports.includes("@mui/material") ? {
				ignoreStyles: [],
				libraryName: "@mui/material",
				libraryDirectory: "",
				libraryChangeCase: "pascalCase"
			} : false,
		].filter(Boolean) as PluginOptions))
	}

	return ({
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (disableChunks) return undefined;
						// if (id.includes("node_modules/@mui")) return "mui.vendor";
						// if (id.includes("node_modules/react/" || "node_modules/react-dom/")) return "react.vendor";
						if (id.includes("node_modules"))
							return "vendor";
					},
				},
			},
		},
		plugins,
		resolve: {
			alias: convertPathToAlias(tsconfig.compilerOptions.paths, basePath),
		},
		server: {
			port: port,
			host: "0.0.0.0",
		},
	});
};

export * from "./internal.vite";
