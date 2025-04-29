import { useState } from "preact/hooks";

export function useMutation<T extends (...args: any) => any>({
	mutationFn,
	onSuccess = () => {},
	onError = () => {},
}: {
	mutationFn: T;
	onSuccess?: (data: Awaited<ReturnType<T>>, params: Parameters<T>[0]) => void;
	onError?: (err: any) => void;
}) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const mutate = async (params: Parameters<T>[0]) => {
		reset();
		setIsLoading(true);

		try {
			const resp = await mutationFn(params);
			onSuccess(resp, params);

			setIsSuccess(true);
		} catch (err) {
			onError(err);

			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		setIsSuccess(false);
		setIsLoading(false);
		setIsError(false);
	};

	return {
		isSuccess,
		isError,
		isLoading,
		mutate,
		reset,
	};
}
