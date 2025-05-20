import { PageProps } from "fresh";

export default function ProfilePage(
	{ state }: PageProps<never, { email_id: string }>,
) {
	return (
		<main className="px-6 py-4">
			<figure className="rounded-3xl h-36 w-36 bg-purple-400 grid place-items-center float-left mr-4">
				<p className="text-white text-headline-medium">T</p>
			</figure>
			<div>
				<p className="text-headline-small">{state.email_id}</p>
			</div>
		</main>
	);
}
