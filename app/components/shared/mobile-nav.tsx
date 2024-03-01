"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { Link, NavLink } from "@remix-run/react";

import { Button } from "#app/components/ui/button.tsx";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#app/components/ui/sheet.tsx";
import { navLinks } from "#app/constants.ts";
import { cn } from "#app/lib/utils.ts";

export function MobileNav(): React.ReactElement {
	return (
		<header className="header">
			<Link to="/" className="flex items-center gap-2 md:py-2">
				<img
					src="/assets/images/logo-text.svg"
					alt="logo"
					width={180}
					height={28}
				/>
			</Link>

			<nav className="flex gap-2">
				<SignedIn>
					<UserButton afterSignOutUrl="/" />
					<Sheet>
						<SheetTrigger>
							<img
								src="/assets/icons/menu.svg"
								alt="menu"
								width={32}
								height={32}
								className="cursor-pointer"
							/>
						</SheetTrigger>
						<SheetContent className="sheet-content sm:w-64">
							<>
								<img
									src="/assets/images/logo-text.svg"
									alt="logo"
									width={152}
									height={23}
								/>
								<ul className="header-nav_elements">
									{navLinks.map((link) => (
										<li key={link.label}>
											<NavLink
												to={link.href}
												className={({ isActive }) => {
													return cn(
														"sidebar-link cursor-pointer p-8 whitespace-nowrap text-dark-700 flex",
														{
															"gradient-text": isActive,
														},
													);
												}}
											>
												<img
													src={link.icon}
													alt={link.label}
													width={18}
													height={18}
												/>
												<span>{link.label}</span>
											</NavLink>
										</li>
									))}
								</ul>
							</>
						</SheetContent>
					</Sheet>
				</SignedIn>
				<SignedOut>
					<Button asChild className="button bg-purple-gradient bg-cover">
						<Link to="/sign-in">Sign In</Link>
					</Button>
				</SignedOut>
			</nav>
		</header>
	);
}
