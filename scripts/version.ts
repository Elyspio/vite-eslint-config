/* eslint-disable import/no-extraneous-dependencies */
import { Octokit } from "@octokit/rest";
import { compare, inc, parse, SemVer } from "semver";
import path from "path";
import * as fs from "fs/promises";
import { execSync } from "child_process";

async function getPackageVersion() {
	const octokit = new Octokit({
		auth: process.env.NODE_AUTH_TOKEN,
	});

	const response = await octokit.packages.getAllPackageVersionsForPackageOwnedByUser({
		package_type: "npm",
		package_name: "vite-eslint-config",
		username: "Elyspio",
	});

	const versions = response.data;

	versions.push({
		...versions[0],
		name: "1.0.1",
	});

	versions.sort((v1, v2) => -compare(v1.name, v2.name));

	return parse(versions[0].name)!;
}

async function writeVersionToPackageJson(version: SemVer) {
	const packageJsonPath = path.resolve(__dirname, "..", "package.json");
	let raw = (await fs.readFile(packageJsonPath)).toString();
	const json = JSON.parse(raw) as { version: string };
	json.version = version.raw;

	raw = JSON.stringify(json, null, 4).replaceAll("    ", "\t");

	await fs.writeFile(packageJsonPath, raw);
}

function tagVersion(version: SemVer) {
	execSync(`git tag ${version.raw}`);
	execSync(`git push origin --tags`);
}

async function main() {
	const latestVersion = await getPackageVersion();
	inc(latestVersion, "minor");
	await writeVersionToPackageJson(latestVersion);
	tagVersion(latestVersion);
}

// eslint-disable-next-line no-void
void main();
