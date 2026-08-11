"use client";

import { Task, FieldVisibility, TaskStatus } from "../../types/task.types";
import { BOARD_STATUSES } from "../../config/task.config";
import { TaskBoardColumn } from "./TaskBoardColumn";

interface TaskBoardViewProps {
  tasks: Task[];
  fields: FieldVisibility;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskBoardView({ tasks, fields, onEdit, onDelete }: TaskBoardViewProps) {
  // Group tasks by board status
  const tasksByStatus = BOARD_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 min-h-[calc(100vh-14rem)] items-start">
      {BOARD_STATUSES.map((status) => (
        <TaskBoardColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status] || []}
          fields={fields}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
