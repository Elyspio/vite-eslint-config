/* eslint-disable import/no-extraneous-dependencies */
import { Octokit } from "@octokit/rest";
import { inc, parse } from "semver";
import path from "path";
import * as fs from "fs/promises";
import axios from "axios";

// region Config
const owner = "Elyspio";
const packageName = "@elyspio/vite-eslint-config";
const repo = "vite-eslint-config";
// endregion Config

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

/**
 * Get latest version of the package from npm registry
 */
async function getPackageVersion() {
	const resp = await axios.get<{ version: string }>(`https://registry.npmjs.org/${packageName}/latest`);

	return parse(resp.data.version)!;
}

/**
 * Write the new version to the package.json
 * @param version
 */
async function writeVersionToPackageJson(version: string) {
	const packageJsonPath = path.resolve(__dirname, "..", "config-dist", "package.json");

	let raw = (await fs.readFile(packageJsonPath)).toString();
	const json = JSON.parse(raw) as { version: string };
	json.version = version;

	raw = JSON.stringify(json, null, 4).replaceAll("    ", "\t");

	await fs.writeFile(packageJsonPath, raw);
}

/**
 * Tag the current commit with the version
 * @param version
 */
async function tagVersion(version: string) {
	const tagName = `v${version}`;
	const commitHash = process.env.GITHUB_SHA!;

	await octokit.request("POST /repos/{owner}/{repo}/git/tags", {
		object: commitHash,
		owner,
		repo,
		tag: tagName,
		type: "commit",
		message: "",
	});

	// Create a reference to the tag using Octokit's `createRef` method
	await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
		owner,
		repo,
		ref: `refs/tags/${tagName}`,
		sha: commitHash,
	});
}

async function main() {
	const serverVersion = await getPackageVersion();
	console.log("server version", serverVersion.raw);

	const newVersion = inc(serverVersion, "patch")!;
	console.log("new version", newVersion);
	await writeVersionToPackageJson(newVersion);
	await tagVersion(newVersion);
}

// eslint-disable-next-line no-void
void main();
