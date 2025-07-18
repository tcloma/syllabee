import { db } from "@syllabee/db";
import { chunks, files } from "@syllabee/db/schema";
import { parseChunkEmbed } from "./textUtils";

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
	const { text, text_chunks, embeddings } = await parseChunkEmbed(file);
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
