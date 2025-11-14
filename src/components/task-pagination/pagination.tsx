"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildPaginationRange } from "@/helpers/pagination";
import type { PaginationProps } from "@/interfaces/task.interface";

export function Pagination({ meta, onPageChange, disabled }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const range = buildPaginationRange(meta.page, meta.totalPages);

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => onPageChange(meta.page - 1)}
        disabled={disabled || meta.page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>
      <div className="flex items-center gap-2">
        {range.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            disabled={disabled}
            className={`h-9 w-9 rounded-full border px-2 text-sm font-semibold transition ${
              pageNumber === meta.page
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => onPageChange(meta.page + 1)}
        disabled={disabled || meta.page === meta.totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

