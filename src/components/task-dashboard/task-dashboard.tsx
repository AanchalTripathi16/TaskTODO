"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { TaskForm } from "@/components/task-form/task-form";
import { TaskList } from "@/components/task-list/task-list";
import { Pagination } from "@/components/task-pagination/pagination";
import { TaskSearch } from "@/components/task-search/task-search";
import { apiClient } from "@/helpers/api-client";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import type { TaskDashboardProps } from "@/interfaces/task.interface";

export function TaskDashboard({
  initialData,
  initialQuery,
}: TaskDashboardProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSearch,
    handlePageChange,
    pageSize,
    query,
    isPending: isFiltering,
  } = useTaskFilters({
    initialQuery,
    initialPage: initialData.page,
    pageSize: initialData.pageSize,
  });

  const paginationMeta = useMemo(
    () => ({
      page: initialData.page,
      pageSize: initialData.pageSize,
      total: initialData.total,
      totalPages: initialData.totalPages,
    }),
    [initialData]
  );

  const refresh = () => {
    router.refresh();
  };

  const handleCreate = async (title: string) => {
    setFeedback(null);
    setIsSubmitting(true);
    try {
      await apiClient("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to create task."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    setFeedback(null);
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          await apiClient(`/api/tasks/${taskId}/toggle`, {
            method: "PATCH",
          });
          refresh();
        } catch (error) {
          setFeedback(
            error instanceof Error
              ? error.message
              : "Unable to update the task."
          );
        } finally {
          resolve();
        }
      });
    });
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Your focus list
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Stay on top of personal tasks
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Every task is private to your account. Search, filter, and keep an
              eye on what is done.
            </p>
          </div>

          {feedback && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback}
            </p>
          )}

          <TaskForm onSubmit={handleCreate} isBusy={isSubmitting} />

          <TaskSearch
            initialQuery={query}
            onSearch={handleSearch}
            disabled={isPending || isSubmitting || isFiltering}
          />
        </div>
      </div>

      <TaskList
        tasks={initialData.items}
        isMutating={isPending || isFiltering}
        onToggle={handleToggle}
        query={query}
      />

      <Pagination
        meta={paginationMeta}
        onPageChange={handlePageChange}
        disabled={isPending}
      />
      <p className="text-center text-xs text-slate-500">
        Showing page {paginationMeta.page} of {paginationMeta.totalPages} |{" "}
        {initialData.total} tasks total | Page size {pageSize}
      </p>
    </section>
  );
}
