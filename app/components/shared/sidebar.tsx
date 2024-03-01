"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { Link, NavLink } from "@remix-run/react";

import { Button } from "#app/components/ui/button.tsx";
import { navLinks } from "#app/constants.ts";
import { cn } from "#app/lib/utils.ts";

export function Sidebar(): React.ReactElement {
	return (
		<aside className="sidebar">
			<div className="flex flex-col gap-4 size-full">
				<Link to="/" className="sidebar-logo">
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
									<NavLink
										to={link.href}
										className={({ isActive }) => {
											return cn("sidebar-link", {
												"bg-purple-gradient text-white": isActive,
												"text-gray-700": !isActive,
											});
										}}
									>
										{({ isActive }) => {
											return (
												<>
													<img
														src={link.icon}
														alt={link.label}
														width={18}
														height={18}
														className={cn({
															"brightness-200": isActive,
														})}
													/>
													<span>{link.label}</span>
												</>
											);
										}}
									</NavLink>
								</li>
							))}
						</ul>
						<ul className="sidebar-nav_elements">
							{navLinks.slice(6).map((link) => (
								<li key={link.label} className="sidebar-nav_element group">
									<NavLink
										to={link.href}
										className={({ isActive }) => {
											return cn("sidebar-link", {
												"bg-purple-gradient text-white": isActive,
												"text-gray-700": !isActive,
											});
										}}
									>
										{({ isActive }) => {
											return (
												<>
													<img
														src={link.icon}
														alt={link.label}
														width={18}
														height={18}
														className={cn({
															"brightness-200": isActive,
														})}
													/>
													<span>{link.label}</span>
												</>
											);
										}}
									</NavLink>
								</li>
							))}
							<li className="flex-center cursor-pointer gap-2 p-4">
								<UserButton afterSignOutUrl="/" showName />
							</li>
						</ul>
					</SignedIn>
					<SignedOut>
						<Button asChild className="button bg-purple-gradient bg-cover">
							<Link to="/sign-in">Sign In</Link>
						</Button>
					</SignedOut>
				</nav>
			</div>
		</aside>
	);
}
