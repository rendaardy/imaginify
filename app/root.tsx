import { ClerkApp, ClerkErrorBoundary } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import globalStyles from "./globals.css?url";

export const meta: MetaFunction = () => {
	return [
		{
			charset: "utf-8",
			title: "Imaginify",
			description: "AI-powered image generator",
			viewport: "width=device-width,initial-scale=1",
		},
	];
};

export const links: LinksFunction = () => {
	return [
		{ rel: "icon", href: "/favicon.ico" },
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
		},
		{ rel: "stylesheet", href: globalStyles },
	];
};

export function loader(
	args: LoaderFunctionArgs,
): ReturnType<typeof rootAuthLoader> {
	return rootAuthLoader(args);
}

export const ErrorBoundary = ClerkErrorBoundary();

function Root(): React.ReactElement {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="font-IBMPlex antialiased">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default ClerkApp(Root, {
	appearance: {
		variables: {
			colorPrimary: "#624cf5",
		},
	},
});
