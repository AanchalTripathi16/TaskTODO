import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
});

export const taskFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(200, "Search query must be 200 characters or fewer.")
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const parseTaskFilters = (
  params: Record<string, string | string[] | undefined>
) => {
  const result = taskFilterSchema.safeParse({
    q: typeof params.q === "string" ? params.q : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
    pageSize: typeof params.pageSize === "string" ? params.pageSize : undefined,
  });

  if (!result.success) {
    throw result.error;
  }

  const { q, ...rest } = result.data;

  return {
    query: q ?? "",
    ...rest,
  };
};
