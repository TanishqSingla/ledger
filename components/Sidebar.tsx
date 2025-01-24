import { twMerge } from "tailwind-merge";

const SidebarConfig = [
	{
		slug: "/dashboard/create",
		label: "Create",
	},
];

export default function Sidebar({ active }: { active: string }) {
	return (
		<div class="w-[280px] h-[calc(100vh-120px)] rounded-2xl bg-surface my-4 px-3">
			{SidebarConfig.map((item, index) => (
				<a
					class={twMerge(
						"px-4 py-2 text-onSurface hover:bg-secondaryFixedDim transition rounded-2xl text-subhead-large cursor-pointer block",
						active === item.slug && "bg-secondary text-onSecondary",
					)}
					key={index}
					href={item.slug}
				>
					{item.label}
				</a>
			))}
		</div>
	);
}
