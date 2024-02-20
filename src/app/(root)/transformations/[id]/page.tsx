type TransformationsPageProps = Readonly<{
	params: Readonly<{
		id: string;
	}>;
}>;

export default function TransformationsPage({
	params,
}: TransformationsPageProps): React.ReactElement {
	return (
		<section>
			<h1>Transformations</h1>
		</section>
	);
}
