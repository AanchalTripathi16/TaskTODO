import { buildPaginationMeta, buildPaginationRange } from "@/helpers/pagination";

describe("pagination helpers", () => {
  it("clamps the current page inside the valid range", () => {
    const meta = buildPaginationMeta({ page: 5, pageSize: 10, total: 25 });
    expect(meta.page).toBe(3);
    expect(meta.totalPages).toBe(3);
  });

  it("returns at least one page even when there are zero records", () => {
    const meta = buildPaginationMeta({ page: 1, pageSize: 10, total: 0 });
    expect(meta.totalPages).toBe(1);
  });

  it("builds a compact pagination range centered on the current page", () => {
    const range = buildPaginationRange(5, 10);
    expect(range).toEqual([4, 5, 6]);
  });
});

