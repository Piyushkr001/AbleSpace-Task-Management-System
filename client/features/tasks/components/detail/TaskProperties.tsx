"use client";

import { Task } from "../../types/task.types";
import { TaskStatusField } from "./TaskStatusField";
import { TaskPriorityField } from "./TaskPriorityField";
import { TaskMembersField } from "./TaskMembersField";
import { TaskDatesField } from "./TaskDatesField";
import { TaskLabelsField } from "./TaskLabelsField";
import { TaskReporterField } from "./TaskReporterField";
import { FolderKanban } from "lucide-react";

interface TaskPropertiesProps {
  task: Task;
}

export function TaskProperties({ task }: TaskPropertiesProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 p-4 space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-1">
        Properties
      </h3>

      <TaskStatusField task={task} />
      <TaskPriorityField task={task} />
      <TaskMembersField task={task} />
      <TaskDatesField task={task} />
      <TaskLabelsField task={task} />
      <TaskReporterField task={task} />

      {/* Project Field (Read-only if project exists) */}
      <div className="flex items-center justify-between gap-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Project</span>
        {task.project ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <FolderKanban className="size-3.5 text-primary" />
            <span>{task.project.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}
