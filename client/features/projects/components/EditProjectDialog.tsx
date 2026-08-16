"use client";

import { useState } from "react";
import { FolderEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "../types/project.types";
import { useUpdateProject } from "../hooks/use-update-project";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const updateProjectMutation = useUpdateProject();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && project) {
      setName(project.name);
      setDescription(project.description || "");
    }
    onOpenChange(newOpen);
  };

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    updateProjectMutation.mutate(
      {
        id: project.id,
        payload: {
          name: trimmedName,
          description: description.trim() || null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FolderEdit className="size-4" />
              </div>
              <DialogTitle className="text-lg font-semibold">Edit Project</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Update project details and settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="edit-project-name" className="text-xs font-medium text-foreground">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-project-description" className="text-xs font-medium text-foreground">
                Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="edit-project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={3}
                className="rounded-xl text-xs resize-none"
              />
            </div>
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
              type="submit"
              disabled={!name.trim() || updateProjectMutation.isPending}
              className="h-9 rounded-xl text-xs font-medium"
            >
              {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
