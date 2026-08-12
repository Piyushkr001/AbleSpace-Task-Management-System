"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "../../types/task.types";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskDatesFieldProps {
  task: Task;
}

export function TaskDatesField({ task }: TaskDatesFieldProps) {
  const updateTaskMutation = useUpdateTask();

  const handleStartDateChange = (val: string) => {
    const newStartDate = val ? val : null;
    if (newStartDate === task.startDate) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { startDate: newStartDate },
    });
  };

  const handleDueDateChange = (val: string) => {
    const newDueDate = val ? val : null;
    if (newDueDate === task.dueDate) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { dueDate: newDueDate },
    });
  };

  return (
    <div className="space-y-1.5 py-1.5 border-b border-border/40">
      {/* Start Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Start Date</span>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={task.startDate || ""}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="h-7 text-xs rounded-lg px-2 border-none bg-transparent hover:bg-accent/50 w-32"
          />
          {task.startDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStartDateChange("")}
              className="size-6 rounded-md text-muted-foreground hover:text-destructive"
              aria-label="Clear start date"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Due Date</span>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={task.dueDate || ""}
            onChange={(e) => handleDueDateChange(e.target.value)}
            className="h-7 text-xs rounded-lg px-2 border-none bg-transparent hover:bg-accent/50 w-32"
          />
          {task.dueDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDueDateChange("")}
              className="size-6 rounded-md text-muted-foreground hover:text-destructive"
              aria-label="Clear due date"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
