"use client";

import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, FieldVisibility } from "../../types/task.types";
import { TASK_STATUS_CONFIG } from "../../config/task.config";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface TaskBoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  fields: FieldVisibility;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskBoardColumn({ status, tasks, fields, onEdit, onDelete }: TaskBoardColumnProps) {
  const statusConfig = TASK_STATUS_CONFIG[status];

  return (
    <div className="flex flex-col w-72 shrink-0 rounded-2xl border border-border/50 bg-muted/20 p-3 h-full max-h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", statusConfig.dotColor)} />
          <h3 className="text-xs font-semibold tracking-tight text-foreground">
            {statusConfig.label}
          </h3>
        </div>

        <Badge
          variant="outline"
          className="h-4.5 rounded-full px-1.5 text-[10px] font-semibold text-muted-foreground border-border/60"
        >
          {tasks.length}
        </Badge>
      </div>

      {/* Cards Stack */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              fields={fields}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/60 text-[11px] text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
