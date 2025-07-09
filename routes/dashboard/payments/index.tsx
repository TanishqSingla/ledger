import { Button } from "ketu";
import { buttonVariants } from "@components/Button.tsx";

export default function Payments() {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Payments</h1>

			<div class="ml-auto">
				<Button
					as="a"
					href="/dashboard/payments/create"
					class={buttonVariants({
						variant: "filled",
						className: "inline-flex items-center",
					})}
				>
					Create
				</Button>
			</div>
		</div>
	);
}
