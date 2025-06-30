import OpenAI from "openai";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function ask(input: string) {
	const res = await client.responses.create({
		model: "gpt-4.1-mini",
		input: input,
	});
	return res.output_text;
}

export async function embed(chunks: string[]) {
	const res = await client.embeddings.create({
		model: "text-embedding-3-small",
		input: chunks,
		encoding_format: "float",
	});
	return res;
}
