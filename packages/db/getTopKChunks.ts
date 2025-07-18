import { sql } from "drizzle-orm";
import { db } from "./client";
import { chunks } from "./schema";

function embeddingArrayToSqlVector(vector: number[]) {
	return `ARRAY[${vector.join(",")}]::vector`;
}

export async function getTopKChunks(
	queryEmbedding: number[],
	k: number,
	classId?: string,
) {
	const queryVector = embeddingArrayToSqlVector(queryEmbedding);

	const results = await db.execute(sql`
    SELECT
      id,
      text,
      file_id,
      class_id
    FROM ${chunks}
    ${classId ? sql`WHERE class_id = ${classId}` : sql``}
    ORDER BY embedding <=> ${sql.raw(queryVector)}
    LIMIT ${k};
  `);

	return results;
}
