import type { TaskEmptyStateProps } from "@/interfaces/task.interface";

export function TaskEmptyState({ query }: TaskEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <p className="text-lg font-semibold text-slate-900">No tasks yet</p>
      <p className="mt-2 text-sm text-slate-500">
        {query
          ? `We could not find tasks matching "${query}".`
          : "Add your first task to get organized."}
      </p>
    </div>
  );
}

