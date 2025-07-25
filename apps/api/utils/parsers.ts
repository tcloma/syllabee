import mammoth from "mammoth";
import PDF from "pdf-parse";

export async function parsePdf(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const result = await PDF(buffer);
	return result.text;
}

export async function parseWord(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const result = await mammoth.extractRawText({ buffer });
	return result.value;
}

export async function parseTextorMD(file: File): Promise<string> {
	const result = await file.text();
	return result;
}
