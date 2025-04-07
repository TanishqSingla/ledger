import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
	"text-white inline-block rounded-2xl text-xs font-bold px-2 py-1",
	{
		variants: {
			variant: {
				neutral: "bg-gray-400",
				outline: "",
				success: "bg-green-600",
				error: "",
				warning: "bg-yellow-500",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
);

type BadgeVariants = {
	variant?: "neutral" | "outline" | "success" | "error" | "warning";
	className?: string;
	text: string;
};

export default function Badge(
	{ variant, className, text }: BadgeVariants,
) {
	return (
		<span className={twMerge(badgeVariants({ variant }), className)}>
			{text}
		</span>
	);
}
