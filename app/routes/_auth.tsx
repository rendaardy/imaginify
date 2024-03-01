import { Outlet } from "@remix-run/react";

export default function AuthLayout(): React.ReactElement {
	return (
		<main className="auth">
			<Outlet />
		</main>
	);
}
