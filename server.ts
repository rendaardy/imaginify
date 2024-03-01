import path from "node:path";
import url from "node:url";

import { fastifyStatic } from "@fastify/static";
import { createRequestHandler } from "@mcansh/remix-fastify";
import { installGlobals } from "@remix-run/node";
import { fastify } from "fastify";

import { webhooks } from "./app/api/webhooks.ts";

installGlobals();

const vite =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((m) => {
				return m.createServer({ server: { middlewareMode: true } });
		  });
const app = fastify({ logger: true });
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

if (vite) {
	const middie = await import("@fastify/middie").then((m) => m.default);
	await app.register(middie);
	await app.use(vite.middlewares);
} else {
	await app.register(fastifyStatic, {
		root: path.join(__dirname, "build", "client", "assets"),
		prefix: "/assets",
		wildcard: true,
		decorateReply: false,
		cacheControl: true,
		dotfiles: "allow",
		etag: true,
		maxAge: "1y",
		immutable: true,
		serveDotFiles: true,
		lastModified: true,
	});

	await app.register(fastifyStatic, {
		root: path.join(__dirname, "build", "client"),
		prefix: "/",
		wildcard: false,
		cacheControl: true,
		dotfiles: "allow",
		etag: true,
		maxAge: "1h",
		serveDotFiles: true,
		lastModified: true,
	});
}

await app.register(webhooks);

await app.register(async function remixPlugin(childApp) {
	childApp.removeAllContentTypeParsers();

	childApp.addContentTypeParser("*", (request, payload, done) => {
		done(null, payload);
	});

	childApp.all("*", async (request, reply) => {
		try {
			const handler = createRequestHandler({
				build: vite
					? () => vite?.ssrLoadModule("virtual:remix/server-build")
					: // @ts-ignore
					  await import("./build/server/index.js"),
			});

			return handler(request, reply);
		} catch (error) {
			childApp.log.error(error);
			return reply.status(500).send(error);
		}
	});
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
await app.listen({ port, host: "0.0.0.0" });
