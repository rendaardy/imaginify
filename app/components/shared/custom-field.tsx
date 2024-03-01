import type {
	Control,
	ControllerProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import { z } from "zod";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#app/components/ui/form.tsx";

type CustomFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Readonly<{
	control?: Control<TFieldValues>;
	name: TName;
	render: ControllerProps<TFieldValues, TName>["render"];
	formLabel?: string;
	className?: string;
}>;

export function CustomField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	render,
	formLabel,
	className,
}: CustomFieldProps<TFieldValues, TName>): React.ReactElement {
	return (
		<FormField
			control={control}
			name={name}
			render={(args) => (
				<FormItem className={className}>
					{formLabel && <FormLabel>{formLabel}</FormLabel>}
					<FormControl>{render(args)}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
