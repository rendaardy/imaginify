import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Header } from "#app/components/shared/header.tsx";
import { TransformationForm } from "#app/components/shared/transformation-form.tsx";
import { transformationTypes } from "#app/constants.ts";
import { getUserById } from "#app/lib/actions/user.ts";

export async function loader(args: LoaderFunctionArgs): Promise<Response> {
	const auth = await getAuth(args);

	if (!auth.userId) {
		return redirect("/sign-in");
	}

	const user = await getUserById(auth.userId);

	if (!user) {
		return redirect("/sign-in");
	}

	const { params } = args;

	if (!params.type) {
		throw new Response("Bad Request", { status: 400 });
	}

	const transformation =
		transformationTypes[
			params.type.replace(/-[a-z]/g, (c) => c.at(1)?.toUpperCase() ?? "")
		];

	return json({ user, transformation });
}

export default function AddTransformationPage(): React.ReactElement {
	const data = useLoaderData<typeof loader>();

	return (
		<section>
			<Header
				title={data.transformation?.title}
				subtitle={data.transformation?.subTitle}
			/>
			<TransformationForm
				action="add"
				userId={data.user.id}
				type={data.transformation?.type ?? "restore"}
				creditBalance={data.user.creditBalance}
				data={null}
			/>
		</section>
	);
}
