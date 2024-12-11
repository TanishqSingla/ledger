export const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH") ?? ":memory:");
