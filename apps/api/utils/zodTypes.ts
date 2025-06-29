import { z } from "zod";

export const uploadBody = z.object({
	file: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
});

export const formData = z.object({
	user_id: z.string().uuid(),
	name: z.string(),
});

export const classIdParam = z.object({
	class_id: z.string().uuid(),
});
