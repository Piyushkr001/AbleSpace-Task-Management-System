"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus, TaskPriority } from "../types/task.types";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, ALL_STATUSES, ALL_PRIORITIES } from "../config/task.config";
import { useCreateTask } from "../hooks/use-create-task";

interface AddTaskDialogProps {
  defaultProjectId?: string;
  trigger?: React.ReactElement;
}

export function AddTaskDialog({ defaultProjectId, trigger }: AddTaskDialogProps = {}) {
  const createTaskMutation = useCreateTask();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("NONE");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        projectId: defaultProjectId || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setStatus("TODO");
          setPriority("NONE");
          setDueDate("");
          setOpen(false);
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
              <span>Add Task</span>
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">New Task</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new task in your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="add-task-title" className="text-xs font-medium text-foreground">
                Task Title
              </Label>
              <Input
                id="add-task-title"
                placeholder="e.g. Design Landing Page Prototype"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-task-desc" className="text-xs font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="add-task-desc"
                placeholder="Optional task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl text-xs min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-task-status" className="text-xs font-medium text-foreground">
                  Status
                </Label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger id="add-task-status" className="h-9 rounded-xl text-xs">
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
                <Label htmlFor="add-task-priority" className="text-xs font-medium text-foreground">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                  <SelectTrigger id="add-task-priority" className="h-9 rounded-xl text-xs">
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
              <Label htmlFor="add-task-duedate" className="text-xs font-medium text-foreground">
                Due Date
              </Label>
              <Input
                id="add-task-duedate"
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
              onClick={() => setOpen(false)}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="h-9 rounded-xl text-xs"
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
