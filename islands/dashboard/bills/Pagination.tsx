import { buttonVariants } from "@components/Button.tsx";
import { twMerge } from "tailwind-merge";

type PaginationProps = {
	currentPage: number;
	total: number;
	limit: number;
};

export default function Pagination(
	{ currentPage, total, limit }: PaginationProps,
) {
	const totalPages = Math.ceil(total / limit);

	const pages = () => {
		if (totalPages < 8) {
			return Array(totalPages).fill(0).map((_, index) => index + 1);
		}

		const pages = [1];
		if (currentPage - 1 >= 4) {
			pages.push(-1);
		}

		pages.push(currentPage - 1);
		pages.push(currentPage);
		pages.push(currentPage + 1);

		if (totalPages - currentPage >= 4) pages.push(-1);

		pages.push(totalPages);

		return pages;
	};

	const handlePageClick = (page: number) => {
		const url = new URL(globalThis.location.href);

		url.searchParams.set("page", String(page));
		globalThis.location.assign(url);
	};

	const handleNext = () => {
		if (currentPage >= totalPages) return;

		const url = new URL(globalThis.location.href);
		url.searchParams.set("page", String(currentPage + 1));

		globalThis.location.assign(url);
	};
	const handlePrev = () => {
		if (currentPage <= 1) return;

		const url = new URL(globalThis.location.href);
		url.searchParams.set("page", String(currentPage - 1));

		globalThis.location.assign(url);
	};

	return (
		<div className="flex justify-center items-center mt-4 gap-4">
			<button
				type="button"
				className={twMerge(
					buttonVariants({ variant: "text" }),
					"rounded-full w-10 h-10 p-0 grid place-items-center",
				)}
				onClick={handlePrev}
				disabled={currentPage == 1}
				aria-label="Previous"
			>
				&lt;
			</button>
			{pages().map((page) => {
				return (page > -1
					? (
						<button
							type="button"
							className={twMerge(
								buttonVariants({
									variant: page == currentPage ? "secondary" : "text",
								}),
								"rounded-full w-8 h-8 p-0 grid place-items-center",
							)}
							onClick={() => handlePageClick(page)}
						>
							{page}
						</button>
					)
					: <span>...</span>);
			})}
			<button
				className={twMerge(
					buttonVariants({ variant: "text" }),
					"rounded-full w-10 h-10 p-0 grid place-items-center",
				)}
				type="button"
				aria-label="Next"
				disabled={currentPage == totalPages}
				onClick={handleNext}
			>
				&gt;
			</button>
		</div>
	);
}
