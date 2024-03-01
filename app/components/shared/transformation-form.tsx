"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "#app/components/ui/button.tsx";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#app/components/ui/form.tsx";
import { Input } from "#app/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#app/components/ui/select.tsx";
import {
	aspectRatioOptions,
	defaultValues,
	transformationTypes,
} from "#app/constants.ts";
import { CustomField } from "./custom-field.tsx";

export const formSchema = z.object({
	title: z.string(),
	aspectRatio: z.string().optional(),
	color: z.string().optional(),
	prompt: z.string().optional(),
	publicId: z.string(),
});

interface Transformations {
	restore?: boolean;
	fillBackground?: boolean;
	remove?: {
		prompt: string;
		removeShadow?: boolean;
		multiple?: boolean;
	};
	recolor?: {
		prompt?: string;
		to: string;
		multiple?: boolean;
	};
	removeBackground?: boolean;
}

type TransformationFormProps = Readonly<{
	action: "add" | "update";
	userId: string;
	type: string;
	creditBalance: number;
	data: z.infer<typeof formSchema> | null;
}>;

export function TransformationForm({
	action,
	type,
	creditBalance,
	userId,
	data = null,
}: TransformationFormProps): React.ReactElement {
	const transformationType = transformationTypes[type];
	const [image, setImage] = useState(data);
	const [newTransformation, setNewTransformation] =
		useState<Transformations | null>(null);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues:
			data && action === "update"
				? {
						title: data?.title ?? "",
						aspectRatio: data?.aspectRatio,
						color: data?.color,
						prompt: data?.prompt,
						publicId: data?.publicId ?? "",
				  }
				: defaultValues,
	});

	const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
		console.log(data);
	};

	const onSelectHandler = (
		value: string,
		onChange: (value: string) => void,
	) => {};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<CustomField
						control={form.control}
						name="title"
						formLabel="Image Title"
						className="w-full"
						render={({ field }) => <Input {...field} className="input-field" />}
					/>
					{type === "fill" && (
						<CustomField
							control={form.control}
							name="aspectRatio"
							formLabel="Aspect Ratio"
							className="w-full"
							render={({ field }) => (
								<Select
									onValueChange={(value) =>
										onSelectHandler(value, field.onChange)
									}
								>
									<SelectTrigger className="select-field">
										<SelectValue placeholder="Select size" />
									</SelectTrigger>
									<SelectContent>
										{Object.keys(aspectRatioOptions).map((key) => (
											<SelectItem key={key} value={key} className="select-item">
												{aspectRatioOptions[key].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					)}
					{(type === "remove" || type === "recolor") && (
						<div className="prompt-field">
							<CustomField
								control={form.control}
								name="prompt"
								formLabel={
									type === "remove" ? "Object to remove" : "Object to recolor"
								}
								render={({ field }) => (
									<Input {...field} className="input-field" />
								)}
							/>
						</div>
					)}
				</form>
			</Form>
		</>
	);
}
