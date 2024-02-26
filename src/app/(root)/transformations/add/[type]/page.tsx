import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Header } from "#/components/shared/header.tsx";
import { TransformationForm } from "#/components/shared/transformation-form.tsx";
import { transformationTypes } from "#/constants.ts";
import { getUserById } from "#/lib/actions/user.ts";

type AddTransformationPageProps = Readonly<{
	params: Readonly<{
		type: string;
	}>;
}>;

export default async function AddTransformationPage({
	params,
}: AddTransformationPageProps): Promise<React.ReactElement> {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const user = await getUserById(userId);

	if (!user) {
		redirect("/sign-in");
	}

	const transformation =
		transformationTypes[
			params.type.replace(/-[a-z]/g, (c) => c.at(1)?.toUpperCase() ?? "")
		];

	return (
		<section>
			<Header
				title={transformation?.title}
				subtitle={transformation?.subTitle}
			/>
			<TransformationForm
				action="add"
				userId={user.id}
				type={transformation?.type ?? "restore"}
				creditBalance={user.creditBalance}
				data={null}
			/>
		</section>
	);
}
