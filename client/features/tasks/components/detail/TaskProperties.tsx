"use client";

import { Task } from "../../types/task.types";
import { TaskStatusField } from "./TaskStatusField";
import { TaskPriorityField } from "./TaskPriorityField";
import { TaskMembersField } from "./TaskMembersField";
import { TaskDatesField } from "./TaskDatesField";
import { TaskLabelsField } from "./TaskLabelsField";
import { TaskReporterField } from "./TaskReporterField";
import { ProjectPicker } from "@/features/projects/components/ProjectPicker";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskPropertiesProps {
  task: Task;
}

export function TaskProperties({ task }: TaskPropertiesProps) {
  const updateTaskMutation = useUpdateTask();

  const handleProjectChange = (projectId: string | null) => {
    if (updateTaskMutation.isPending) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: {
        projectId: projectId ?? null,
      },
    });
  };

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

      {/* Project Field */}
      <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
        <span className="text-xs font-medium text-muted-foreground">Project</span>
        <ProjectPicker
          value={task.project?.id ?? null}
          onChange={handleProjectChange}
          disabled={updateTaskMutation.isPending}
          variant="popover"
          placeholder="No project"
        />
      </div>
    </div>
  );
}
