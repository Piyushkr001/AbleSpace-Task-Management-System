"use client";

import { useState } from "react";
import { FolderPlus, Plus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateProject } from "../hooks/use-create-project";

interface CreateProjectDialogProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateProjectDialogProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createProjectMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    createProjectMutation.mutate(
      {
        name: trimmedName,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setOpen?.(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            trigger
          ) : (
            <Button
              size="sm"
              className="h-9 rounded-xl px-3.5 font-medium shadow-xs bg-primary hover:opacity-90 text-xs"
            >
              <Plus className="size-3.5 mr-1.5" />
              <span>New Project</span>
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FolderPlus className="size-4" />
              </div>
              <DialogTitle className="text-lg font-semibold">Create Project</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Group and track related tasks under a dedicated project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="project-name" className="text-xs font-medium text-foreground">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="h-9 rounded-xl text-xs"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="project-description" className="text-xs font-medium text-foreground">
                Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="project-description"
                placeholder="Add high-level goals or context for this project..."
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
              onClick={() => setOpen?.(false)}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createProjectMutation.isPending}
              className="h-9 rounded-xl text-xs font-medium"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
