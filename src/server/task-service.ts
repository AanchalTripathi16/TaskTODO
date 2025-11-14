import { prisma } from "@/lib/prisma";
import type { TaskCollectionResponse } from "@/interfaces/task.interface";
import { buildPaginationMeta } from "@/helpers/pagination";

interface ListTasksArgs {
  userId: string;
  query?: string;
  page: number;
  pageSize: number;
}

interface CreateTaskArgs {
  userId: string;
  title: string;
}

interface ToggleTaskArgs {
  userId: string;
  taskId: string;
}

const toViewModel = (task: {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
}) => ({
  id: task.id,
  title: task.title,
  done: task.done,
  createdAt: task.createdAt.toISOString(),
});

export const listTasks = async ({
  userId,
  query,
  page,
  pageSize,
}: ListTasksArgs): Promise<TaskCollectionResponse> => {
  const where = {
    userId,
    ...(query
      ? {
          title: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const skip = (page - 1) * pageSize;

  const [total, tasks] = await prisma.$transaction([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
  ]);

  const meta = buildPaginationMeta({ page, pageSize, total });

  return {
    items: tasks.map(toViewModel),
    ...meta,
    total,
  };
};

export const createTask = async ({ userId, title }: CreateTaskArgs) => {
  const trimmed = title.trim();

  const task = await prisma.task.create({
    data: {
      title: trimmed,
      userId,
    },
  });

  return toViewModel(task);
};

export const toggleTask = async ({ taskId, userId }: ToggleTaskArgs) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    return null;
  }

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      done: !task.done,
    },
  });

  return toViewModel(updated);
};
