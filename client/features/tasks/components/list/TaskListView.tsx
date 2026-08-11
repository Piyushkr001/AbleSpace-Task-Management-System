"use client";

import { Task, FieldVisibility, TaskStatus } from "../../types/task.types";
import { ALL_STATUSES } from "../../config/task.config";
import { TaskGroup } from "./TaskGroup";

interface TaskListViewProps {
  tasks: Task[];
  fields: FieldVisibility;
}

export function TaskListView({ tasks, fields }: TaskListViewProps) {
  // Group tasks by status
  const tasksByStatus = ALL_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="space-y-6 pt-2">
      {ALL_STATUSES.map((status) => (
        <TaskGroup
          key={status}
          status={status}
          tasks={tasksByStatus[status] || []}
          fields={fields}
        />
      ))}
    </div>
  );
}
