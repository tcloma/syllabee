import mammoth from "mammoth";
import PDF from "pdf-parse";
import { encoding_for_model } from "tiktoken";

export async function parseText(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());

	switch (true) {
		case file.type.includes("pdf"): {
			const data = await PDF(buffer);
			return data.text;
		}
		case file.type.includes("word"): {
			const data = await mammoth.extractRawText({
				buffer,
			});
			return data.value;
		}
		case file.type.includes("text/plain") ||
			file.type.includes("text/markdown"):
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
	chunks.push(currentChunk.trim());
	return chunks;
}

export function isValidFileType(fileType: string): boolean {
	return (
		fileType.includes("pdf") ||
		fileType.includes("word") ||
		fileType.includes("text/plain") ||
		fileType.includes("text/markdown")
	);
}
