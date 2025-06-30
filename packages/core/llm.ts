import OpenAI from "openai";
import { getSystemContext, getUserContext } from "./context";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function ask(context: string, message: string) {
	const res = await client.responses.create({
		model: "gpt-4.1",

		input: [
			{ role: "system", content: getSystemContext() },
			{ role: "user", content: getUserContext(context, message) },
		],
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
