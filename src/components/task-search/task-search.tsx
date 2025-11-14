"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { TaskSearchProps } from "@/interfaces/task.interface";

export function TaskSearch({
  initialQuery,
  onSearch,
  disabled = false,
}: TaskSearchProps) {
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleReset = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/50 p-4 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by title..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>
      <div className="flex gap-2">
        {value && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            disabled={disabled}
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </button>
        )}
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
        >
          Search
        </button>
      </div>
    </form>
  );
}

