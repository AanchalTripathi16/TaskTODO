import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { toggleTask } from "@/server/task-service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let taskId = typeof params.id === "string" ? params.id.trim() : "";
  if (!taskId) {
    const body = await request.json().catch(() => null);
    taskId =
      (typeof body?.taskId === "string" && body.taskId.trim()) ||
      (typeof body?.id === "string" && body.id.trim()) ||
      "";
  }

  if (!taskId) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    taskId = pathSegments.at(pathSegments.length - 2) ?? "";
  }

  if (!taskId) {
    return NextResponse.json(
      { message: "Task id is required" },
      { status: 400 }
    );
  }

  const task = await toggleTask({ taskId, userId: session.user.id });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}
