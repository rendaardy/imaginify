import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { transform } from "@swc/core";

const extensionsRegex = /\.(tsx?)$/;

export async function load(url, context, nextLoad) {
	if (extensionsRegex.test(url)) {
		const path = fileURLToPath(url);
		const rawSource = await readFile(path, { encoding: "utf-8" });
		const output = await transform(rawSource, {
			filename: url,
			jsc: {
				target: "esnext",
				parser: {
					syntax: "typescript",
					tsx: true,
					dynamicImport: true,
					decorators: true,
				},
				transform: {
					react: {
						runtime: "automatic",
					},
					useDefineForClassFields: true,
					decoratorVersion: "2022-03",
				},
				preserveAllComments: true,
			},
			module: {
				type: "es6",
				strict: true,
			},
			sourceMaps: "inline",
		});

		return {
			format: "module",
			shortCircuit: true,
			source: output.code,
		};
	}

	return nextLoad(url, context);
}
