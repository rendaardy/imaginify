"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "#/components/ui/button.tsx";
import { navLinks } from "#/constants.ts";
import { cn } from "#/lib/utils.ts";

export function Sidebar(): React.ReactElement {
	const pathname = usePathname();

	return (
		<aside className="sidebar">
			<div className="flex flex-col gap-4 size-full">
				<Link href="/" className="sidebar-logo">
					<img
						src="/assets/images/logo-text.svg"
						alt="logo"
						width={180}
						height={28}
					/>
				</Link>
				<nav className="sidebar-nav">
					<SignedIn>
						<ul className="sidebav-nav_elements">
							{navLinks.slice(0, 6).map((link) => (
								<li key={link.label} className="sidebar-nav_element group">
									<Link
										href={link.href}
										className={cn("sidebar-link", {
											"bg-purple-gradient text-white": pathname === link.href,
											"text-gray-700": pathname !== link.href,
										})}
									>
										<img
											src={link.icon}
											alt={link.label}
											width={18}
											height={18}
											className={cn({
												"brightness-200": pathname === link.href,
											})}
										/>
										<span>{link.label}</span>
									</Link>
								</li>
							))}
						</ul>
						<ul className="sidebar-nav_elements">
							{navLinks.slice(6).map((link) => (
								<li key={link.label} className="sidebar-nav_element group">
									<Link
										href={link.href}
										className={cn("sidebar-link", {
											"bg-purple-gradient text-white": pathname === link.href,
											"text-gray-700": pathname !== link.href,
										})}
									>
										<img
											src={link.icon}
											alt={link.label}
											width={18}
											height={18}
											className={cn({
												"brightness-200": pathname === link.href,
											})}
										/>
										<span>{link.label}</span>
									</Link>
								</li>
							))}
							<li className="flex-center cursor-pointer gap-2 p-4">
								<UserButton afterSignOutUrl="/" showName />
							</li>
						</ul>
					</SignedIn>
					<SignedOut>
						<Button asChild className="button bg-purple-gradient bg-cover">
							<Link href="/sign-in">Sign In</Link>
						</Button>
					</SignedOut>
				</nav>
			</div>
		</aside>
	);
}
