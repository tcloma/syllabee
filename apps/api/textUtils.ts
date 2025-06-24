import mammoth from "mammoth";
import PDF from "pdf-parse";
import { encoding_for_model } from "tiktoken";

export async function parseText(file: File): Promise<string> {
	switch (true) {
		case file.type.includes("pdf"): {
			const data = await PDF(Buffer.from(await file.arrayBuffer()));
			return data.text;
		}
		case file.type.includes("word"): {
			const data = await mammoth.extractRawText({
				buffer: Buffer.from(await file.arrayBuffer()),
			});
			return data.value;
		}
		case file.type.includes("text/plain"):
			return await file.text();
		case file.type.includes("text/markdown"):
			return await file.text();
		default:
			return "";
	}
}

export function chunkText(text: string): string[] {
	const enc = encoding_for_model("gpt-4.1-mini");
	const chunks: string[] = [];

	const maxTokens = 512;
	let currentChunk = "";
	let currentTokens = 0;

	for (const paragraph of text.split(/\n\s*\n/)) {
		const tokens = enc.encode(paragraph);
		if (currentTokens + tokens.length > maxTokens) {
			chunks.push(currentChunk);
			currentChunk = paragraph;
			currentTokens = tokens.length;
		} else {
			currentChunk += `\n\n${paragraph}`;
			currentTokens += tokens.length;
		}
	}
	chunks.push(currentChunk);
	return chunks;
}
