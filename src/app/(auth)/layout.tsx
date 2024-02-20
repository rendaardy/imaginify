type AuthGroupLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function AuthGroupLayout({
	children,
}: AuthGroupLayoutProps): React.ReactElement {
	return <main className="auth">{children}</main>;
}
