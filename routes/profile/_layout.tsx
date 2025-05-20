import { PageProps, RouteConfig } from "fresh";
import Sidebar from "@components/Sidebar.tsx";
import ProfileDropdown from "../../islands/molecules/profile-dropdown.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default function Layout({ Component, url }: PageProps) {
	return (
		<>
			<header class="p-4 text-onBackground rounded-2xl flex justify-between">
				<a class="text-headline-large" href="/dashboard">Ledger</a>
				<div>
					<ProfileDropdown />
				</div>
			</header>
			<div class="flex h-[calc(100vh-72px)]">
				<Sidebar active={url.pathname} />
				<div class="flex-grow bg-surfaceContainerLowest text-onSurface rounded-3xl">
					<Component />
				</div>
			</div>
		</>
	);
}
