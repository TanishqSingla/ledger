import { PlusIcon, TrashIcon } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { useEffect, useState } from "preact/hooks";
import Input from "@components/Input.tsx";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { getBankInfo } from "@queries/vendor.ts";
import { BankInfo } from "@/types.ts";

const AccountForm = ({ id }: { id: string }) => {
	const [ifsc, setIfsc] = useState("");
	const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);

	useEffect(() => {
		if (!/\w{4}0[a-zA-Z0-9]{6}/.test(ifsc)) {
			setBankInfo(null);
			return;
		}

		(async () => {
			const resp = await getBankInfo(ifsc);

			if (resp == "Not Found") {
				setBankInfo(null);
				return;
			}

			setBankInfo(resp);
		})();
	}, [ifsc]);

	return (
		<>
			<label>
				<p>Account number</p>
				<Input name={`account_number_$${id}`} placeholder="Account number" />
			</label>
			<label>
				<p>IFSC</p>
				<Input
					name={`ifsc_$${id}`}
					placeholder="IFSC"
					value={ifsc}
					onInput={(e) => setIfsc((e.target as HTMLInputElement).value)}
				/>
			</label>
			<label>
				<p>Bank name</p>
				<Input
					name={`bank_name_$${id}`}
					placeholder="Bank name"
					className={`read-only:bg-surfaceVariant read-only:border-gray-50 read-only:text-gray-400`}
					readonly={!!bankInfo}
					value={bankInfo?.BANK}
				/>
			</label>
			<label>
				<p>Branch name</p>
				<Input
					name={`branch_name_$${id}`}
					placeholder="Branch name"
					className={`read-only:bg-surfaceVariant read-only:border-gray-50 read-only:text-gray-400`}
					readonly={!!bankInfo}
					value={bankInfo?.BRANCH}
				/>
			</label>
		</>
	);
};

export default function AddAccountForm() {
	const [formIds, setFormIds] = useState<string[]>([]);

	const appendForms = () => {
		setFormIds([...formIds, nanoid(8)]);
	};

	const handleDelete = (id: string) =>
		setFormIds(formIds.filter((formId) => formId !== id));

	return (
		<>
			{formIds.map((id, index) => (
				<div className="p-4 rounded-xl border border-tertiary my-4">
					<div className="flex justify-between">
						<p className="text-title-medium">Add Account #{index + 1}</p>
						<button
							className={buttonVariants({ variant: "destructiveOutline" })}
							type="button"
							title="Remove account"
							onClick={() => handleDelete(id)}
						>
							<TrashIcon />
						</button>
					</div>
					<AccountForm key={id} id={id} />
				</div>
			))}

			<button
				type="button"
				className={buttonVariants({
					variant: "outline",
					className: "flex items-center gap-4 my-4",
				})}
				onClick={appendForms}
			>
				<PlusIcon /> Add Account
			</button>
		</>
	);
}
