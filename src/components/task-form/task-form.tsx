"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createTaskSchema } from "@/lib/validation/task";
import type { TaskFormProps } from "@/interfaces/task.interface";

type TaskFormValues = z.infer<typeof createTaskSchema>;

export function TaskForm({ onSubmit, isBusy }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "" },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values.title);
    reset();
  });

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label
          htmlFor="task-title"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Title
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="Ship FocusFlow"
          autoComplete="off"
          disabled={isBusy}
          {...register("title")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isBusy}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}

