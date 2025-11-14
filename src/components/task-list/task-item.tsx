"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";

import type { TaskItemProps } from "@/interfaces/task.interface";

export function TaskItem({ task, onToggle, disabled }: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={task.done}
          aria-label={task.done ? "Mark task as not done" : "Mark task as done"}
          onClick={handleToggle}
          disabled={disabled || isLoading}
          className="inline-flex h-8 w-14 items-center rounded-full border border-slate-200 bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            className={`relative inline-flex h-6 w-full items-center rounded-full transition ${
              task.done ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute left-1 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white text-slate-500 shadow transition ${
                task.done ? "translate-x-5 bg-white" : "translate-x-0"
              }`}
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />
              ) : (
                <CheckCircle2
                  className={`h-4 w-4 ${
                    task.done ? "text-emerald-500" : "text-slate-400"
                  }`}
                />
              )}
            </span>
          </span>
        </button>
        <div>
          <p
            className={`text-base font-medium ${
              task.done ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-slate-500">
            Added {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </li>
  );
}
