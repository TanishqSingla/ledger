export type Data = {
	email_id: string;
	filters: {
		accountId: string;
		status: string;
		accountNo: string;
	};
};

export default function DashboardPage() {
	return (
		<section class="max-w-screen-xl mx-auto">
			<div class="my-4 bg-surfaceContainerHighest rounded-md p-4"></div>
		</section>
	);
}
