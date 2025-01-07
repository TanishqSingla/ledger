import { LayoutConfig, PageProps } from "$fresh/server.ts";

export const config: LayoutConfig = {
	skipInheritedLayouts: true,
};

export default function Layout({ Component }: PageProps) {
	return (
		<>
			<header class="mx-auto max-w-screen-xl my-4 bg-surfaceContainer p-4 rounded-2xl text-onSurface">
				<a class="text-size5" href="/dashboard">Ledger</a>
			</header>
			<Component />
		</>
	);
}
