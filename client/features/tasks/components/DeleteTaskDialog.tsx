"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "../types/task.types";
import { useDeleteTask } from "../hooks/use-delete-task";

interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onDeleted,
}: DeleteTaskDialogProps) {
  const deleteTaskMutation = useDeleteTask();

  if (!task) return null;

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id, {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-destructive">
            Delete Task
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{task.title}&quot;</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
            className="h-9 rounded-xl text-xs"
          >
            {deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
