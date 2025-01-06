import { ComponentProps } from "preact";
import { ClassNameValue } from "tailwind-merge";
import { twMerge } from "tailwind-merge";

export default function Input(props: ComponentProps<"input">) {
	return (
		<input
			class={twMerge(
				"w-full bg-surfaceBright px-4 py-2 text-lg rounded-lg",
				props.class as ClassNameValue,
			)}
			{...props}
		/>
	);
}
