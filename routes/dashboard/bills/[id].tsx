import { PageProps } from "$fresh/server.ts";

export default function Bill({ params }: PageProps) {
	return <div class="p-4">hello {params.id}</div>
}
