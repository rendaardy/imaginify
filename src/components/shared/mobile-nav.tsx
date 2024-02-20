"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "#/components/ui/button.tsx";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet.tsx";
import { navLinks } from "#/constants.ts";
import { cn } from "#/lib/utils.ts";

export function MobileNav(): React.ReactElement {
	const pathname = usePathname();

	return (
		<header className="header">
			<Link href="/" className="flex items-center gap-2 md:py-2">
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
										<li
											key={link.label}
											className={cn(
												"p-18 whitespace-nowrap text-dark-700 flex",
												{
													"gradient-text": pathname === link.href,
												},
											)}
										>
											<Link
												href={link.href}
												className="sidebar-link cursor-pointer"
											>
												<img
													src={link.icon}
													alt={link.label}
													width={18}
													height={18}
												/>
												<span>{link.label}</span>
											</Link>
										</li>
									))}
								</ul>
							</>
						</SheetContent>
					</Sheet>
				</SignedIn>
				<SignedOut>
					<Button asChild className="button bg-purple-gradient bg-cover">
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</SignedOut>
			</nav>
		</header>
	);
}
