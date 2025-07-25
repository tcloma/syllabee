import { db } from "@syllabee/db";
import { chunks, files } from "@syllabee/db/schema";
import { embed } from "packages/core/llm";
import { chunkText, parseText } from "./textUtils";

export async function processUpload(file: File, class_id: string) {
	const { name, type, size } = file;
	const uploaded_file = await db
		.insert(files)
		.values({
			class_id,
			name,
			type,
			size,
		})
		.returning();

	const text = await parseText(file);
	if (text.isErr()) {
		console.error("Failed to parse file:", text.error);
		throw new Error("File parsing failed");
	}
	const text_chunks = chunkText(text.value);
	const embeddings = (await embed(text_chunks)).data;

	const file_id = uploaded_file[0]?.id as string;

	for (let i = 0; i < text_chunks.length; i++) {
		const embedding = embeddings[i]?.embedding as number[];

		const uploaded_chunk = await db
			.insert(chunks)
			.values({
				file_id,
				class_id,
				text,
				embedding,
				chunk_index: i,
			})
			.returning();
		console.log("Chunk uploaded:", uploaded_chunk);
	}

	return uploaded_file;
}
