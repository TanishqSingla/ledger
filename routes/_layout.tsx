import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
	return (
		<main class="flex flex-col md:flex-row h-screen bg-surface">
			<aside class="w-full px-4 py-8 bg-primaryContainer md:grid md:place-items-center md:rounded-tr-3xl md:rounded-br-3xl">
				<a href="/">
					<h1 class="text-3xl text-onPrimaryContainer md:text-4xl lg:text-5xl">
						Ledger
					</h1>
				</a>
			</aside>
			<Component />
		</main>
	);
}
