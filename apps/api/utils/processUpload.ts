import { db } from "@syllabee/db";
import { chunks, files } from "@syllabee/db/schema";
import { err, ok, ResultAsync } from "neverthrow";
import { embed } from "packages/core/llm";
import { chunkText, validateAndParseText } from "./textUtils";

export async function processUpload(file: File, class_id: string) {
	const { name, type, size } = file;

	// 1. Checks if the file is valid
	// 2. If it is valid, it Parses the text content
	const parseResult = await validateAndParseText(file);
	if (parseResult.isErr()) {
		console.error("Failed to parse file:", parseResult.error);
		return err(parseResult.error);
	}

	// 2. Chunks the text content to a specific token size for text-embedding-3-small
	const textChunks = chunkText(parseResult.value);

	// 3. Generates embeddings for each chunk
	const embeddingResult = await ResultAsync.fromPromise(
		embed(textChunks),
		() => new Error("Failed to generate embeddings"),
	);
	if (embeddingResult.isErr()) {
		console.error("Failed to generate embeddings:", embeddingResult.error);
		return err(embeddingResult.error);
	}

	// 4. Inserts the file record into the database
	const insertResult = await ResultAsync.fromPromise(
		db
			.insert(files)
			.values({
				class_id,
				name,
				type,
				size,
			})
			.returning(),
		() => new Error("Failed to insert file record"),
	);

	if (insertResult.isErr()) {
		console.error("Failed to insert file record:", insertResult.error);
		return err(insertResult.error);
	}

	// biome-ignore lint/style/noNonNullAssertion: <.returning() always returns an array with at least one element, of which the id is guaranteed to be present>
	const uploadedFile = insertResult.value[0]!;

	// 5. Inserts each chunk into the database
	for (let i = 0; i < textChunks.length; i++) {
		// Placeholder for the embedding, which is an array of numbers,
		// Down the line, if embedding is missing we can attempt to re-embed
		const embedding = embeddingResult.value.data[i]?.embedding ?? [];

		const uploadedChunk = await ResultAsync.fromPromise(
			db
				.insert(chunks)
				.values({
					file_id: uploadedFile.id,
					class_id,
					text: parseResult.value,
					embedding,
					chunk_index: i,
				})
				.returning({ index: chunks.chunk_index, text: chunks.text }),
			() => new Error("Failed to insert chunk record"),
		);

		if (uploadedChunk.isErr()) {
			console.error("Failed to insert chunk record:", uploadedChunk.error);
			return err(uploadedChunk.error);
		}

		console.log("Chunk uploaded:", uploadedChunk.value);
	}

	return ok(uploadedFile);
}
