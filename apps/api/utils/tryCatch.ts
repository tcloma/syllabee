// Result types
type Success<T> = {
	data: T;
	error: null;
};

type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Async try/catch wrapper
export async function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}

// Sync try/catch wrapper
export function tryCatchSync<T, E = Error>(callback: () => T): Result<T, E> {
	try {
		const data = callback();
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}

export enum ErrorCode {
	INVALID_INPUT = "INVALID_INPUT",

	// Chunking
	CHUNKING_FAILED = "CHUNKING_FAILED",

	// Embedding
	EMBEDDING_FAILED = "EMBEDDING_FAILED",
	NO_EMBEDDING_RETURNED = "NO_EMBEDDING_RETURNED",

	// Vector Search
	VECTOR_SEARCH_FAILED = "VECTOR_SEARCH_FAILED",

	// LLM
	LLM_PROMPT_FAILED = "LLM_PROMPT_FAILED",
	STREAMING_FAILED = "STREAMING_FAILED",
}
