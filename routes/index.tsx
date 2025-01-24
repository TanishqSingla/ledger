import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "@std/http/cookie";
import { verify } from "@zaubrik/djwt";
import { cryptoKey } from "../utils/secrets.ts";
import { findUser } from "../db/Users.ts";
import { EMAIL_REGEX } from "../utils/constants.ts";
import { sendEmail } from "../utils/mailer.ts";
import { kv } from "../utils/db.ts";
import Input from "../components/Input.tsx";

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

		if (!cookies.token) {
			return ctx.render();
		}

		try {
			await verify(cookies.token, cryptoKey);

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
	async POST(req, ctx) {
		try {
			const formData = await req.formData();
			const email = formData.get("email");

			if (!email || !EMAIL_REGEX.test(email.toString())) {
				return ctx.render(
					{
						status: "error",
						error: {
							email: "Invalid email",
						},
					} satisfies Data,
				);
			}

			const user = await findUser(email.toString());
			if (!user) {
				return ctx.render(
					{
						status: "error",
						error: {
							email: "User does not exist",
						},
					} satisfies Data,
				);
			}

			const verificationCode = Math.floor(Math.random() * 1000000);
			await kv.set(["verify", user.email_id], {
				verification_code: verificationCode,
			}, {
				expireIn: 60 * 1000,
			});

			try {
				const emailResult = await sendEmail({
					subject: "One Time Password",
					to: [user.email_id],
					body: `Your verification code is <br /> <p>${verificationCode}</p>`,
				});

				console.log("Email sent", emailResult);
			} catch (err) {
				console.log(err);
				return ctx.render(
					{
						status: "error",
						error: { message: "Error with email client contact admin" },
					} satisfies Data,
				);
			}

			return Response.redirect(
				ctx.url.origin + "/auth/verify" + `?email=${user.email_id}`,
			);
		} catch (err) {
			console.log(err);

			return ctx.render(
				{
					status: "error",
					error: {
						message: err.message as string,
					},
				} satisfies Data,
			);
		}
	},
};

export default function Home({ data }: PageProps<Data | undefined>) {
	return (
		<section class="h-full w-full md:grid md:place-items-center">
			<form
				action="/"
				method="POST"
				class="rounded-3xl bg-secondaryContainer p-4 w-11/12 mx-auto text-onSecondaryContainer mt-24 max-w-3xl"
			>
				<h3 class="text-size5 mb-4 mt-2 text-onSecondaryContainer font-semibold">
					Log in
				</h3>
				<label
					class="block my-2 text-onSecondaryContainer text-size6"
					for="email"
				>
					Email
				</label>
				<Input
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
					class="bg-primary/80 w-full p-4 rounded-full text-onPrimary my-8 text-lg cursor-pointer hover:bg-primary/70 active:bg-primary text-size6"
				>
					Sign in
				</button>
				{data?.status === "success" && (
					<span class="text-onPrimaryContainer">{data.success.message}</span>
				)}
			</form>
		</section>
	);
}
