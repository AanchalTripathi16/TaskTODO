import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth-options";
import { createTaskSchema, parseTaskFilters } from "@/lib/validation/task";
import { createTask, listTasks } from "@/server/task-service";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const normalized = parseTaskFilters(queryData);

    const data = await listTasks({
      userId: session.user.id,
      query: normalized.query,
      page: normalized.page,
      pageSize: normalized.pageSize,
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid query parameters" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Unable to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validation = createTaskSchema.safeParse(body);

  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return NextResponse.json(
      { message: firstIssue?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }

  const task = await createTask({
    userId: session.user.id,
    title: validation.data.title,
  });

  return NextResponse.json(task, { status: 201 });
}
