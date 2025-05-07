import { Handlers, PageProps } from "$fresh/server.ts";

type Data = {
	email_id: string;
};

export const handler: Handlers = {
	GET: (_, ctx) => {
		return ctx.render({ email_id: ctx.state.email_id });
	},
};

export default function ProfilePage({ data }: PageProps<Data>) {
	return (
		<main className={"px-6 py-4"}>
			<figure
				className={"rounded-3xl h-36 w-36 bg-purple-400 grid place-items-center float-left mr-4"}
			>
				<p className={"text-white text-headline-medium"}>T</p>
			</figure>
			<div>
				<p className={"text-headline-small"}>{data.email_id}</p>
			</div>
		</main>
	);
}
