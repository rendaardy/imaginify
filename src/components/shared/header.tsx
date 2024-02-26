export type HeaderProps = Readonly<{
	title: string;
	subtitle?: string;
}>;

export function Header({ title, subtitle }: HeaderProps): React.ReactElement {
	return (
		<>
			<h2 className="h2-bold text-dark-600">{title}</h2>
			{subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
		</>
	);
}
