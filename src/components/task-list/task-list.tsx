"use client";

import { TaskEmptyState } from "@/components/task-list/task-empty-state";
import { TaskItem } from "@/components/task-list/task-item";
import type { TaskListProps } from "@/interfaces/task.interface";

export function TaskList({
  tasks,
  isMutating,
  onToggle,
  query,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <TaskEmptyState query={query} />;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          disabled={isMutating}
        />
      ))}
    </ul>
  );
}

