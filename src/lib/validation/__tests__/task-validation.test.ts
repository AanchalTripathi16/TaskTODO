import { describe, expect, it } from "vitest";

import {
  createTaskSchema,
  parseTaskFilters,
  taskFilterSchema,
} from "@/lib/validation/task";

describe("task validation", () => {
  it("enforces title length and trimming", () => {
    const result = createTaskSchema.safeParse({ title: " Ship " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Ship");
    }
  });

  it("rejects empty titles", () => {
    const result = createTaskSchema.safeParse({ title: " " });
    expect(result.success).toBe(false);
  });

  it("parses pagination params with defaults", () => {
    const parsed = parseTaskFilters({});
    expect(parsed).toEqual({ query: "", page: 1, pageSize: 10 });
  });

  it("caps pageSize at 100", () => {
    const result = taskFilterSchema.safeParse({ pageSize: 500 });
    expect(result.success).toBe(false);
  });
});

