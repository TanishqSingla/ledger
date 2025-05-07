type SendEmailParams = {
	body: string;
	subject: string;
	to: string[];
};

export const sendEmail = (params: SendEmailParams) => {
	const result = fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
		},
		body: JSON.stringify({
			from: Deno.env.get('EMAIL_SENDER'),
			html: params.body,
			subject: params.subject,
			to: params.to,
		}),
	});

	return result;
};
