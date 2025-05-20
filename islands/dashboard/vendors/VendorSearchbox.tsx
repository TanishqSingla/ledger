import Input from "@components/Input.tsx";
import { signal } from "@preact/signals";
import { CrossCircle } from "@components/icons/index.tsx";
import { ComponentProps } from "preact";

export const vendorSearch = signal("");

export default function VendorSearchBox({ ...props }: ComponentProps<"input">) {
	return (
		<div class="overflow-hidden relative">
			<Input
				onInput={(e) => vendorSearch.value = e.currentTarget.value}
				value={vendorSearch.value}
				placeholder="Search vendor"
				{...props}
			/>
			{!!vendorSearch.value && (
				<button
					type="button"
					onClick={() => vendorSearch.value = ""}
					title="clear"
					class="mr-2 outline-none focus:ring-1 top-1/2 right-1 absolute -translate-y-1/2"
				>
					<CrossCircle />
				</button>
			)}
		</div>
	);
}
