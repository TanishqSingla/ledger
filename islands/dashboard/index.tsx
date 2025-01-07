import { useEffect, useState } from "preact/hooks";
import { Data } from "../../routes/dashboard/index.tsx";
import { GetStatements, Statement } from "../../db/Statements.ts";

export default function Dashboard(
	{ filters }: { filters: Data["filters"] },
) {
	const [statement, setStatement] = useState<Statement[] | null>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		const selectedAccount = filters?.accountId == "all"
			? null
			: filters.accountId;

		if (!selectedAccount) {
			GetStatements({ limit: 10 }).then((data) => {
				setStatement(data);
			});
		}

		return () => {
			setLoading(false);
		};
	}, []);

	return (
		<table class="table-auto w-full">
			<thead class="bg-primary rounded-lg">
				<tr>
					<th class="text-onPrimary">S.No.</th>
					<th class="text-onPrimary">Account Name</th>
					<th class="text-onPrimary">Payee Name</th>
					<th class="text-onPrimary">Amount</th>
					<th class="text-onPrimary">Resources</th>
				</tr>
			</thead>
			{loading
				? <div>loading...</div>
				: <>{statement && statement.map((statement) => <>{statement.Id}</>)}</>}
		</table>
	);
}
