export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { TaskDashboard } from "@/components/task-dashboard/task-dashboard";
import { authOptions } from "@/lib/auth-options";
import { parseTaskFilters } from "@/lib/validation/task";
import { listTasks } from "@/server/task-service";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      redirect("/signin");
    }

    const resolvedSearchParams = await searchParams;

    let filters;
    try {
      filters = parseTaskFilters(resolvedSearchParams);
    } catch {
      filters = { query: "", page: 1, pageSize: 10 };
    }

    const data = await listTasks({
      userId: session.user.id,
      query: filters.query,
      page: filters.page,
      pageSize: filters.pageSize,
    });

    return <TaskDashboard initialData={data} initialQuery={filters.query} />;
  } catch (error) {
    console.error("Error in TasksPage:", error);
    redirect("/signin");
  }
}
