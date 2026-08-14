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
import { Project } from "../types/project.types";
import { useDeleteProject } from "../hooks/use-delete-project";

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProjectDialogProps) {
  const deleteProjectMutation = useDeleteProject();

  if (!project) return null;

  const handleDelete = () => {
    deleteProjectMutation.mutate(project.id, {
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
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{project.name}&quot;</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/70 bg-muted/30 p-3 my-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-0.5">Tasks will be preserved</p>
          Deleting this project does not delete its tasks. Any tasks currently inside this project will remain accessible in your workspace without a project assigned.
        </div>

        <DialogFooter className="pt-2">
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
            disabled={deleteProjectMutation.isPending}
            className="h-9 rounded-xl text-xs"
          >
            {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
