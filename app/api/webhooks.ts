import { type WebhookEvent, createClerkClient } from "@clerk/remix/api.server";
import type { FastifyInstance } from "fastify";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "#app/lib/actions/user.ts";

async function webhooks(app: FastifyInstance): Promise<void> {
	app.post("/api/webhooks/clerk", async (request, reply) => {
		if (!process.env.WEBHOOK_SECRET) {
			throw new Error("Please add WEBHOOK_SECRET to your .env file");
		}

		const svixId = request.headers["svix-id"] as string | undefined;
		const svixTimestamp = request.headers["svix-timestamp"] as
			| string
			| undefined;
		const svixSignature = request.headers["svix-signature"] as
			| string
			| undefined;

		if (!svixId || !svixTimestamp || !svixSignature) {
			return reply.status(400).send("Error occured -- no svix headers");
		}

		const payload = request.body;
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
			app.log.error("Error verifying webhook", error);
			return reply.status(400).send("Error verifying webhook");
		}

		const { id } = evt.data;
		const eventType = evt.type;

		const clerkClient = createClerkClient({});

		switch (eventType) {
			case "user.created": {
				const {
					id,
					email_addresses: [{ email_address: emailAddress }],
					image_url: imageUrl,
					first_name: firstName,
					last_name: lastName,
					username,
				} = evt.data;

				const formData = new FormData();
				formData.append("clerkId", id.toString());
				formData.append("email", emailAddress ?? "");
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

				return reply
					.status(201)
					.type("application/json")
					.send({ message: "OK", user: result.data });
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

				return reply
					.status(201)
					.type("application/json")
					.send({ message: "OK", user: result.data });
			}
			case "user.deleted": {
				const { id } = evt.data;
				const formData = new FormData();
				formData.append("clerkId", id?.toString() ?? "");

				await deleteUser(formData);

				return reply
					.status(201)
					.type("application/json")
					.send({ message: "OK" });
			}
		}

		console.log(
			`Webhook with and ID of ${id} and type of ${eventType} was received.`,
		);
		console.log("Webhook body:", body);

		return reply
			.status(400)
			.type("application/json")
			.send({ message: "Bad Request" });
	});
}

export { webhooks };
