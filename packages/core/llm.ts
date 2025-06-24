import OpenAI from "openai";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function talk(input: string) {
	const res = await client.responses.create({
		model: "gpt-4.1-mini",
		input: input,
	});
	return res.output_text;
}
