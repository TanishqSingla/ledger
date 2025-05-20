import { deleteCookie } from "@std/http/cookie";
import { HandlerByMethod } from "fresh";

export const handler: HandlerByMethod<unknown, unknown> = {
	GET(_ctx) {
		const headers = new Headers();

		deleteCookie(headers, "token");

		headers.append("Location", "/");
		return new Response("", {
			status: 307,
			headers,
		});
	},
};
