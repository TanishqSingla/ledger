import { ComponentProps } from "preact";
import { twMerge } from "tailwind-merge";

export default function Input(props: ComponentProps<"input">) {
	return (
		<input
			{...props}
			class={twMerge(
				"w-full bg-surfaceBright px-4 py-2 text-body-large rounded-lg",
				props.class as string,
			)}
		/>
	);
}
