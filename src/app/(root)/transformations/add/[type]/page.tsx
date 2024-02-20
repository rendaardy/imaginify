type AddTransformationPageProps = Readonly<{
	params: Readonly<{
		type: string;
	}>;
}>;

export default function AddTransformationPage({
	params,
}: AddTransformationPageProps): React.ReactElement {
	return (
		<section>
			<h1>Add Transformation Page</h1>
		</section>
	);
}
