"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Task, TaskPriority } from "../../types/task.types";
import { TASK_PRIORITY_CONFIG, ALL_PRIORITIES } from "../../config/task.config";
import { useUpdateTask } from "../../hooks/use-update-task";
import { cn } from "@/lib/utils";

interface TaskPriorityFieldProps {
  task: Task;
}

export function TaskPriorityField({ task }: TaskPriorityFieldProps) {
  const updateTaskMutation = useUpdateTask();

  const handlePriorityChange = (newPriority: TaskPriority) => {
    if (newPriority === task.priority) return;
    updateTaskMutation.mutate({
      id: task.id,
      payload: { priority: newPriority },
    });
  };

  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground">Priority</span>
      <Select value={task.priority} onValueChange={(val) => handlePriorityChange(val as TaskPriority)}>
        <SelectTrigger className="h-8 border-none bg-transparent hover:bg-accent/50 rounded-xl px-2 text-xs font-medium w-auto focus:ring-0">
          <SelectValue>
            <Badge
              variant="outline"
              className={cn("h-5 rounded-md px-1.5 text-[10px] font-medium border", priorityConfig.badgeStyle)}
            >
              {priorityConfig.label}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          {ALL_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p} className="text-xs cursor-pointer">
              {TASK_PRIORITY_CONFIG[p].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
