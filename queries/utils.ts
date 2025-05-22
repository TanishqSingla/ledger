type FetcherOptions = {
	params: Record<string, string | number>;
	body: Record<string, unknown>;
};

class Fetcher {
	baseURL: URL;

	constructor(base?: string) {
		this.baseURL = base
			? new URL(base)
			: new URL(globalThis.location?.origin || "https://myledger.deno.dev");
	}

	async get<T>(url: string, params?: Record<string, string | number>) {
		const _url = new URL(url, this.baseURL);

		if (params) {
			Object.entries(params).map(([key, value]) =>
				_url.searchParams.set(key, String(value))
			);
		}

		const response = await fetch(_url);
		const data = await response.json();

		return data as T;
	}

	async put<T>() {
	}

	async post<T = unknown>(url: string, options?: FetcherOptions) {
		const _url = new URL(url, this.baseURL);

		if (options?.params) {
			Object.entries(options.params).map(([key, value]) =>
				_url.searchParams.set(key, String(value))
			);
		}

		const response = await fetch(_url, {
			body: JSON.stringify(options?.body || ""),
			method: "POST",
		});
		const data = await response.json();

		Object.assign(response, { data } as { data: T });
		return response;
	}

	async patch<T>() {
	}

	async delete<T = unknown>(
		url: string,
		options?: FetcherOptions,
	) {
		const _url = new URL(url, this.baseURL);

		if (options?.params) {
			Object.entries(options.params).map(([key, value]) =>
				_url.searchParams.set(key, String(value))
			);
		}

		const response = await fetch(_url, {
			body: JSON.stringify(options?.body || ""),
			method: "DELETE",
		});
		const data = await response.json();

		Object.assign(response, { data } as { data: T });
		return response;
	}
}

export const fetcher = new Fetcher();
