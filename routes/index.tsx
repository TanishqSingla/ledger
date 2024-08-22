import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "@std/http/cookie";
import { verify } from "@zaubrik/djwt";
import { cryptoKey } from "../utils/secrets.ts";

type Data = {
	status: "error";
	error: {
		email?: string;
		message?: string;
	};
} | {
	status: "success";
	success: {
		message: string;
	};
};

export const handler: Handlers = {
	async GET(req, ctx) {
		const cookies = getCookies(req.headers);

		if (!cookies.jwt) {
			return ctx.render();
		}

		try {
			await verify(cookies.jwt, cryptoKey);

			return Response.redirect(ctx.url.origin + "/dashboard");
		} catch (err) {
			console.log(err);
			return ctx.render(
				{
					status: "error",
					error: { message: err.message },
				} satisfies Data,
			);
		}
	},
};

export default function Home({ data }: PageProps<Data | undefined>) {
	return (
		<main class="flex flex-col md:flex-row h-screen bg-surface">
			<aside class="w-full px-4 py-8">
				<a href="/">
					<h1 class="text-3xl text-onSurface">Ledger</h1>
				</a>
			</aside>
			<section class="h-full w-full">
				<form
					action="/"
					method="POST"
					class="rounded-xl bg-secondaryContainer p-4 w-11/12 mx-auto text-onSecondaryContainer mt-24"
				>
					<h3 class="text-2xl mb-4 mt-2">Log in</h3>
					<label class="block my-2">Email</label>
					<input
						class="w-full border border-black bg-surfaceBright p-4 text-lg rounded-lg"
						placeholder="example@example.com"
						required
						type="email"
						name="email"
						id="email"
					/>
					{data?.status === "error" && data.error.email && (
						<span class="text-error">{data.error.email}</span>
					)}
					<button
						type="submit"
						class="bg-primary w-full p-4 rounded-full text-onPrimary my-4 text-lg cursor-pointer"
						disabled={data?.status === "success"}
					>
						Sign in
					</button>
					{data?.status === "success" && (
						<span class="text-tertiary">{data.success.message}</span>
					)}
				</form>
			</section>
		</main>
	);
}
