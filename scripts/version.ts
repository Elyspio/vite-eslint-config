/* eslint-disable import/no-extraneous-dependencies */
import { Octokit } from "@octokit/rest";
import { compare, inc, parse, SemVer } from "semver";
import path from "path";
import * as fs from "fs/promises";

const octokit = new Octokit({
	auth: process.env.NODE_AUTH_TOKEN,
});

const owner = "Elyspio";

async function getPackageVersion() {
	const response = await octokit.packages.getAllPackageVersionsForPackageOwnedByUser({
		package_type: "npm",
		package_name: "vite-eslint-config",
		username: owner,
	});

	const versions = response.data;

	versions.sort((v1, v2) => -compare(v1.name, v2.name));

	return parse(versions[0].name)!;
}

async function writeVersionToPackageJson(version: string) {
	const packageJsonPath = path.resolve(__dirname, "..", "package.json");
	let raw = (await fs.readFile(packageJsonPath)).toString();
	const json = JSON.parse(raw) as { version: string };
	json.version = version;

	raw = JSON.stringify(json, null, 4).replaceAll("    ", "\t");

	await fs.writeFile(packageJsonPath, raw);
}

const repo = "vite-eslint-config";

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
	const newVersion = inc(serverVersion, "minor")!;
	console.log("new version", serverVersion.raw);
	await writeVersionToPackageJson(newVersion);
	await tagVersion(newVersion);
}

// eslint-disable-next-line no-void
void main();
