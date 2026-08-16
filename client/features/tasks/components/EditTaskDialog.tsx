"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus, TaskPriority } from "../types/task.types";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, ALL_STATUSES, ALL_PRIORITIES } from "../config/task.config";
import { useUpdateTask } from "../hooks/use-update-task";
import { ProjectPicker } from "@/features/projects/components/ProjectPicker";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const updateTaskMutation = useUpdateTask();

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "TODO");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "NONE");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [projectId, setProjectId] = useState<string | null>(task?.project?.id ?? null);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "NONE");
      setDueDate(task.dueDate || "");
      setProjectId(task.project?.id ?? null);
    }
  }, [open, task]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "NONE");
      setDueDate(task.dueDate || "");
      setProjectId(task.project?.id ?? null);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    updateTaskMutation.mutate(
      {
        id: task.id,
        payload: {
          title: title.trim(),
          description: description ? (description.trim().length > 0 ? description.trim() : null) : null,
          status,
          priority,
          dueDate: dueDate || null,
          projectId: projectId ?? null,
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
    <Dialog open={open && Boolean(task)} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Edit Task</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update task parameters in your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="edit-task-title" className="text-xs font-medium text-foreground">
                Task Title
              </Label>
              <Input
                id="edit-task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-task-desc" className="text-xs font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="edit-task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional task description..."
                className="rounded-xl text-xs min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-task-status" className="text-xs font-medium text-foreground">
                  Status
                </Label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger id="edit-task-status" className="h-9 rounded-xl text-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {TASK_STATUS_CONFIG[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-task-priority" className="text-xs font-medium text-foreground">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                  <SelectTrigger id="edit-task-priority" className="h-9 rounded-xl text-xs">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {ALL_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="text-xs">
                        {TASK_PRIORITY_CONFIG[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Project
              </Label>
              <ProjectPicker
                value={projectId}
                onChange={setProjectId}
                variant="select"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-task-duedate" className="text-xs font-medium text-foreground">
                Due Date
              </Label>
              <Input
                id="edit-task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 rounded-xl text-xs"
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
              disabled={updateTaskMutation.isPending}
              className="h-9 rounded-xl text-xs"
            >
              {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
