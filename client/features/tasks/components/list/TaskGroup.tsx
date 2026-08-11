"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, FieldVisibility } from "../../types/task.types";
import { TASK_STATUS_CONFIG } from "../../config/task.config";
import { TaskRow } from "./TaskRow";
import { cn } from "@/lib/utils";

interface TaskGroupProps {
  status: TaskStatus;
  tasks: Task[];
  fields: FieldVisibility;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskGroup({ status, tasks, fields, onEdit, onDelete }: TaskGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const statusConfig = TASK_STATUS_CONFIG[status];

  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg select-none group"
      >
        {isOpen ? (
          <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}

        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", statusConfig.dotColor)} />
          <h3 className="text-xs font-semibold tracking-tight text-foreground">
            {statusConfig.label}
          </h3>
          <Badge
            variant="outline"
            className="h-4 rounded-full px-1.5 text-[10px] font-semibold text-muted-foreground border-border/50"
          >
            {tasks.length}
          </Badge>
        </div>
      </button>

      {/* Task Rows List */}
      {isOpen && (
        <div className="space-y-1.5 pl-2 sm:pl-4">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              fields={fields}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
