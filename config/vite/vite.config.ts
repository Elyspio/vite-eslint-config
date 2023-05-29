import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import tsconfig from "../tsconfig.json";
import { UserConfig } from "vite";
import { convertPathToAlias } from "./internal.vite";
import vitePluginImport from "vite-plugin-babel-import";
import checker from "vite-plugin-checker";


type GetConfigParams = {
	basePath?: string,
	preserveImports?: boolean,
	disableChunks?: boolean
}


export const getDefaultConfig = ({ basePath, preserveImports, disableChunks }: GetConfigParams): UserConfig => {

	basePath ??= __dirname,
		preserveImports ??= false;
	disableChunks ??= false;


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
		checker({
			// e.g. use TypeScript check
			typescript: true,
			
		}),
	];

	if (!preserveImports) {
		plugins.push(vitePluginImport([
			{
				ignoreStyles: [],
				libraryName: "@mui/icons-material",
				libraryDirectory: "",
				libraryChangeCase: "pascalCase"
			},
			{
				ignoreStyles: [],
				libraryName: "@mui/material",
				libraryDirectory: "",
				libraryChangeCase: "pascalCase"
			},
		]))
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
			port: 3000,
			host: "0.0.0.0",
		},
	});
};

export * from "./internal.vite";
