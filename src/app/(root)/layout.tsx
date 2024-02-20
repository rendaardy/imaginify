import { MobileNav } from "#/components/shared/mobile-nav.tsx";
import { Sidebar } from "#/components/shared/sidebar.tsx";

type RootGroupLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootGroupLayout({
	children,
}: RootGroupLayoutProps): React.ReactElement {
	return (
		<main className="root">
			<Sidebar />
			<MobileNav />
			<div className="root-container">
				<div className="wrapper">{children}</div>
			</div>
		</main>
	);
}
