import { clerkClient } from "@clerk/nextjs";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "#/lib/actions/user.ts";

export async function POST(req: Request): Promise<Response> {
	if (!process.env.WEBHOOK_SECRET) {
		throw new Error("Please add WEBHOOK_SECRET to your .env file");
	}

	const headerPayload = headers();
	const svixId = headerPayload.get("svix-id");
	const svixTimestamp = headerPayload.get("svix-timestamp");
	const svixSignature = headerPayload.get("svix-signature");

	if (!svixId || !svixTimestamp || !svixSignature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const wh = new Webhook(process.env.WEBHOOK_SECRET);
	let evt: WebhookEvent;

	try {
		evt = wh.verify(body, {
			"svix-id": svixId,
			"svix-timestamp": svixTimestamp,
			"svix-signature": svixSignature,
		}) as WebhookEvent;
	} catch (error) {
		console.error("Error verifying webhook", error);
		return new Response("Error occured", { status: 400 });
	}

	const {
		type: eventType,
		data: { id },
	} = evt;

	switch (eventType) {
		case "user.created": {
			const {
				id,
				email_addresses: emailAddresses,
				image_url: imageUrl,
				first_name: firstName,
				last_name: lastName,
				username,
			} = evt.data;

			const formData = new FormData();
			formData.append("clerkId", id.toString());
			formData.append("emailAddresses", emailAddresses.at(0)?.toString() ?? "");
			formData.append("photo", imageUrl);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("username", username?.toString() ?? "");

			const result = await createUser(formData);

			if (result.success) {
				await clerkClient.users.updateUserMetadata(id, {
					publicMetadata: {
						userId: result.data?.id,
					},
				});
			}

			return Response.json({ message: "OK", user: result.data });
		}
		case "user.updated": {
			const {
				id,
				image_url: imageUrl,
				first_name: firstName,
				last_name: lastName,
				username,
			} = evt.data;

			const formData = new FormData();
			formData.append("clerkId", id.toString());
			formData.append("photo", imageUrl);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("username", username?.toString() ?? "");

			const result = await updateUser(formData);

			return Response.json({ message: "OK", user: result.data });
		}
		case "user.deleted": {
			const { id } = evt.data;
			const formData = new FormData();
			formData.append("clerkId", id?.toString() ?? "");

			await deleteUser(formData);

			return Response.json({ message: "OK" });
		}
	}

	console.log(
		`Webhook with and ID of ${id} and type of ${eventType} was received.`,
	);
	console.log("Webhook body:", body);

	return new Response("", { status: 200 });
}
