import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "@std/http/cookie";

export const handler: Handlers = {
	GET(_, ctx) {
		const headers = new Headers();

		deleteCookie(headers, "token");

		headers.append("Location", "/");
		return new Response("", {
			status: 307,
			headers,
		});
	},
};
