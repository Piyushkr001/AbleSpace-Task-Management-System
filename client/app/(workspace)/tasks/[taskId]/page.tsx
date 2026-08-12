"use client";

import { use } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTask } from "@/features/tasks/hooks/use-task";
import { TaskDetail } from "@/features/tasks/components/detail/TaskDetail";
import { ApiError } from "@/lib/api-client";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function TaskDetailPage({ params }: PageProps) {
  const { taskId } = use(params);
  const { data: task, isLoading, isError, error, refetch } = useTask(taskId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary mb-2" />
        <p className="text-xs font-medium">Loading task details...</p>
      </div>
    );
  }

  if (isError || !task) {
    const isNotFound =
      !task &&
      error instanceof ApiError &&
      (error.status === 404 || error.status === 403);

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-8 space-y-4 max-w-md mx-auto">
        <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {isNotFound ? "Task not found" : "Unable to load task"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isNotFound
              ? "This task may have been deleted or does not exist in your current workspace."
              : "We couldn't load this task right now. Please check your connection and try again."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 rounded-xl text-xs"
          >
            <RefreshCw className="size-3 mr-1.5" />
            Retry
          </Button>
          <Link href="/tasks">
            <Button size="sm" className="h-8 rounded-xl text-xs">
              <ArrowLeft className="size-3.5 mr-1.5" />
              Back to Tasks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <TaskDetail task={task} />;
}
