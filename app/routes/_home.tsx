import { Outlet } from "@remix-run/react";

import { MobileNav } from "#app/components/shared/mobile-nav.tsx";
import { Sidebar } from "#app/components/shared/sidebar.tsx";

export default function HomePage(): React.ReactElement {
	return (
		<main className="root">
			<Sidebar />
			<MobileNav />
			<div className="root-container">
				<div className="wrapper">
					<Outlet />
				</div>
			</div>
		</main>
	);
}
