import { db } from "@syllaby/db";
import { chunks } from "@syllaby/db/schema";
import { sql } from "drizzle-orm";

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
