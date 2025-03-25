import { ComponentProps } from "preact";
import { twMerge } from "tailwind-merge";

export default function Input(props: ComponentProps<"input">) {
	return (
		<input
			{...props}
			className={twMerge(
				"border border-outline focus:border-primary focus:border-2 bg-transparent h-full focus:outline-none px-4 py-2 rounded-md text-onSurface w-full",
				props.className as string,
			)}
		/>
	);
}
