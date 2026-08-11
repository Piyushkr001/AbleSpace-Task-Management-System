"use client";

import { Task, FieldVisibility, TaskStatus } from "../../types/task.types";
import { ALL_STATUSES } from "../../config/task.config";
import { TaskBoardColumn } from "./TaskBoardColumn";

interface TaskBoardViewProps {
  tasks: Task[];
  fields: FieldVisibility;
}

export function TaskBoardView({ tasks, fields }: TaskBoardViewProps) {
  // Group tasks by status
  const tasksByStatus = ALL_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 min-h-[calc(100vh-14rem)] items-start">
      {ALL_STATUSES.map((status) => (
        <TaskBoardColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status] || []}
          fields={fields}
        />
      ))}
    </div>
  );
}
