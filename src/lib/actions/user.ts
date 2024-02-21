"use server";

import type { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "#/db.ts";

type ActionResponse<T = unknown> = {
	success: boolean;
	message: string;
	data: T;
};

const createUserSchema = z.object({
	clerkId: z.string(),
	email: z.string().email(),
	username: z.string().min(3),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	photo: z.string(),
});

const updateUserSchema = z.object({
	clerkId: z.string(),
	email: z.string().email().optional(),
	username: z.string().min(3).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	photo: z.string().optional(),
});

const deleteUserSchema = z.object({
	clerkId: z.string(),
});

const updateCreditsSchema = z.object({
	userId: z.string(),
	creditFee: z.string().pipe(z.coerce.number()),
});

export async function createUser(
	formData: FormData,
): Promise<ActionResponse<User | null>> {
	const validatedFields = createUserSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!validatedFields.success) {
		return {
			success: false,
			message: validatedFields.error.errors[0].message,
			data: null,
		};
	}

	const { clerkId, email, username, firstName, lastName, photo } =
		validatedFields.data;

	try {
		const user = await db.user.create({
			data: {
				clerkId,
				email,
				username,
				firstName,
				lastName,
				photo,
			},
		});

		return {
			success: true,
			message: "User created successfully",
			data: user,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to create user",
			data: null,
		};
	}
}

export async function getUserById(id: string): Promise<User | null> {
	try {
		const user = await db.user.findUnique({
			where: {
				clerkId: id,
			},
		});

		if (!user) {
			return null;
		}

		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updateUser(
	formData: FormData,
): Promise<ActionResponse<User | null>> {
	const validatedFields = updateUserSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!validatedFields.success) {
		return {
			success: false,
			message: validatedFields.error.errors[0].message,
			data: null,
		};
	}

	const { clerkId, email, username, firstName, lastName, photo } =
		validatedFields.data;

	try {
		const user = await db.user.update({
			where: {
				clerkId,
			},
			data: {
				email: email ?? undefined,
				username: username ?? undefined,
				firstName: firstName ?? undefined,
				lastName: lastName ?? undefined,
				photo: photo ?? undefined,
			},
		});

		revalidatePath("/");

		return {
			success: true,
			message: "User updated successfully",
			data: user,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to update user",
			data: null,
		};
	}
}

export async function deleteUser(formData: FormData): Promise<ActionResponse> {
	const validatedFields = deleteUserSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!validatedFields.success) {
		return {
			success: false,
			message: validatedFields.error.errors[0].message,
			data: null,
		};
	}

	const { clerkId } = validatedFields.data;

	try {
		await db.user.delete({
			where: {
				clerkId,
			},
		});

		revalidatePath("/");

		return {
			success: true,
			message: "User deleted successfully",
			data: null,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to delete user",
			data: null,
		};
	}
}

export async function updateCredits(
	formData: FormData,
): Promise<ActionResponse<User | null>> {
	const validatedFields = updateCreditsSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!validatedFields.success) {
		return {
			success: false,
			message: validatedFields.error.errors[0].message,
			data: null,
		};
	}

	const { userId, creditFee } = validatedFields.data;

	try {
		const updatedUser = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				creditBalance: {
					increment: creditFee,
				},
			},
		});

		revalidatePath("/");

		return {
			success: true,
			message: "Credits updated successfully",
			data: updatedUser,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to update credits",
			data: null,
		};
	}
}
