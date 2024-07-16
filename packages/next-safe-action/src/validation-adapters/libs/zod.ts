import type { z } from "zod";
import type { Infer, ValidationAdapter } from "../types";

class ZodAdapter<S extends z.ZodType> implements ValidationAdapter<S> {
	async validate(schema: S, data: unknown) {
		const result = await schema.safeParseAsync(data);

		if (result.success) {
			return {
				success: true,
				data: result.data as Infer<S>,
			} as const;
		}

		return {
			success: false,
			issues: result.error.issues.map(({ message, path }) => ({ message, path })),
		} as const;
	}
}

export function zodAdapter() {
	return new ZodAdapter<z.ZodType>();
}
