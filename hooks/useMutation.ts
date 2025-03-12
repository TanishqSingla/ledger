import { useState } from "preact/hooks";

export function useMutation<T extends (...args: any) => any>({
	mutationFn,
	onSuccess,
}: { mutationFn: T; onSuccess: (data: Awaited<ReturnType<T>>) => void }) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const mutate = async (params: Parameters<T>[0]) => {
		reset();
		setIsLoading(true);

		try {
			const resp = await mutationFn(params);
			onSuccess(resp);

			setIsSuccess(true);
		} catch (err) {
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
};

