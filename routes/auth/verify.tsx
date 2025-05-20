import { HandlerByMethod, PageProps } from "fresh";
import { create } from "@zaubrik/djwt";
import { kv } from "@utils/db.ts";
import { cryptoKey } from "@utils/secrets.ts";
import { Cookie, setCookie } from "jsr:@std/http@^1.0.3/cookie";
import Input from "@components/Input.tsx";

type Data = {
	email?: string;
	error?: string;
};

export const handler: HandlerByMethod<Data, unknown> = {
	GET(ctx) {
		const req = ctx.req;
		const queryParams = new URL(req.url).searchParams.get("email");
		if (!queryParams) {
			return Response.redirect(ctx.url.origin);
		}

		return { data: { email: queryParams } };
	},

	async POST(ctx) {
		const req = ctx.req;
		const formData = await req.formData();

		const email = formData.get("email")!.toString();
		const verificationCode = formData.get("verification_code")!.toString();

		const key = await kv.get<{ verification_code: number }>(["verify", email!]);

		if (!key.value || key.value.verification_code !== +verificationCode) {
			return { data: { error: "Invalid verification code" } };
		}

		await kv.delete(["verify", email]);

		const headers = new Headers();
		headers.set("Location", "/dashboard");

		const jwt = await create(
			{ alg: "HS512" },
			{ email_id: email },
			cryptoKey,
		);

		const cookie: Cookie = {
			name: "token",
			value: jwt,
			maxAge: 3600 * 24 * 30,
			httpOnly: true,
			path: "/",
		};
		setCookie(headers, cookie);

		return new Response(null, {
			status: 302,
			headers,
		});
	},
};

export default function Verify({ data }: PageProps<Data>) {
	return (
		<section class="h-full w-full md:grid md:place-items-center">
			<form
				action="/auth/verify"
				method="POST"
				class="rounded-3xl bg-secondaryContainer p-4 w-11/12 mx-auto text-onSecondaryContainer mt-24 max-w-3xl"
			>
				<h3 class="text-2xl mb-4 mt-2 text-onSecondaryContainer font-semibold">
					Verify
				</h3>

				<input type="hidden" value={data.email} name="email" />

				<label
					htmlFor="verification_code"
					class="block my-2 text-onSecondaryContainer"
				>
					Enter verification code
				</label>
				<Input
					name="verification_code"
					id="verification_code"
					placeholder="XXX-XX-XXX"
				/>
				{data?.error && <span class="text-error">{data.error}</span>}
				<button
					type="submit"
					class="bg-primary w-full p-4 rounded-full text-onPrimary my-8 text-lg cursor-pointer"
				>
					Submit
				</button>
			</form>
		</section>
	);
}
