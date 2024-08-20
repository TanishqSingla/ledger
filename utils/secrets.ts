import { create } from "@zaubrik/djwt";

async function getCryptoKey() {
	const encoder = new TextEncoder();

	const secret = Deno.env.get("JWT_SECRET")!;
	const secretBuffer = encoder.encode(secret);

	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		secretBuffer,
		{ name: "HMAC", hash: "SHA-512" },
		false,
		["sign", "verify"],
	);
	return cryptoKey;
}

export const cryptoKey = await getCryptoKey();

export const createJWT = (data: { email: string }) => {
	create({ alg: "HS512" }, data, cryptoKey);
};
