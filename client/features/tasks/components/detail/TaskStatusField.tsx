"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus } from "../../types/task.types";
import { TASK_STATUS_CONFIG, ALL_STATUSES } from "../../config/task.config";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskStatusFieldProps {
  task: Task;
}

export function TaskStatusField({ task }: TaskStatusFieldProps) {
  const updateTaskMutation = useUpdateTask();

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    updateTaskMutation.mutate({
      id: task.id,
      payload: { status: newStatus },
    });
  };

  const statusConfig = TASK_STATUS_CONFIG[task.status];

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground">Status</span>
      <Select value={task.status} onValueChange={(val) => handleStatusChange(val as TaskStatus)}>
        <SelectTrigger className="h-8 border-none bg-transparent hover:bg-accent/50 rounded-xl px-2 text-xs font-medium w-auto focus:ring-0">
          <SelectValue>
            <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px] font-medium">
              {statusConfig.label}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          {ALL_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="text-xs cursor-pointer">
              {TASK_STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
