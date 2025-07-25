import { err, type Result, ResultAsync } from "neverthrow";
import { encoding_for_model } from "tiktoken";
import { parsePdf, parseTextorMD, parseWord } from "./parsers";

export async function parseText(file: File): Promise<Result<string, Error>> {
	if (file.type.includes("pdf")) {
		return ResultAsync.fromPromise(
			parsePdf(file),
			() => new Error("Failed to parse PDF document"),
		);
	} else if (file.type.includes("word")) {
		return ResultAsync.fromPromise(
			parseWord(file),
			() => new Error("Failed to parse Word document"),
		);
	} else if (
		file.type.includes("text/plain") ||
		file.type.includes("text/markdown")
	) {
		return ResultAsync.fromPromise(
			parseTextorMD(file),
			() => new Error("Failed to parse text file"),
		);
	} else {
		return err(new Error("Unsupported file type"));
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
