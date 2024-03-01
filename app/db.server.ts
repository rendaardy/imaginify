import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!globalThis.prisma) {
		globalThis.prisma = new PrismaClient();
	}
	prisma = globalThis.prisma;
}

export { prisma as db };

declare global {
	// biome-ignore lint/suspicious/noRedeclare: type definition
	// biome-ignore lint/style/noVar: <explanation>
	var prisma: PrismaClient | undefined;
}
