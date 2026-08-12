"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "../../types/task.types";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TaskDescription } from "./TaskDescription";
import { TaskProperties } from "./TaskProperties";
import { TaskSubtasks } from "./TaskSubtasks";
import { DeleteTaskDialog } from "../DeleteTaskDialog";

interface TaskDetailProps {
  task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteSuccess = () => {
    router.replace("/tasks");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <TaskDetailHeader task={task} onDeleteClick={() => setIsDeleteDialogOpen(true)} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Description & Subtasks (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <TaskDescription task={task} />
          <TaskSubtasks task={task} />
        </div>

        {/* Right Column: Metadata Properties Sidebar (1/3 width) */}
        <div className="lg:col-span-1">
          <TaskProperties task={task} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteTaskDialog
        task={task}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) handleDeleteSuccess();
        }}
      />
    </div>
  );
}
