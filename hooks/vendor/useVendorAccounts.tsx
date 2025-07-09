import { computed, signal } from "@preact/signals";
import { useMutation } from "../useMutation.ts";
import { addVendorAccount, deleteVendorAccount } from "@queries/vendor.ts";
import { VendorDocument } from "@/types.ts";

export const accountsSignal = signal<VendorDocument["accounts"] | null>(null);

export const useVendorAccounts = (initialData: VendorDocument["accounts"]) => {
	const data = computed(() => {
		if (accountsSignal.value) {
			return accountsSignal.value;
		}

		return initialData;
	});

	const deleteMutation = useMutation({
		mutationFn: deleteVendorAccount,
		onSuccess: (_, params) => {
			accountsSignal.value = data.value.filter((account) =>
				account.id != params.accountId
			);
		},
	});

	const createMutation = useMutation({
		mutationFn: addVendorAccount,
		onSuccess: (_, params) => {
			accountsSignal.value = [...data.value, params.account];
		},
	});

	/**
	 * @param vendor_id - id of vendor that contains the accounts
	 * @param account_id - `id` of account that needs to be deleted found as 'account.id`
	 */
	const handleDelete = (vendor_id: string, accountId: string) => {
		deleteMutation.mutate({ vendor_id, accountId });
	};

	return {
		data,
		handleDelete,
		createMutation,
	};
};
