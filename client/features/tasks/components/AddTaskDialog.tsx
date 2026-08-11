"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { TaskStatus, TaskPriority, Task } from "../types/task.types";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, ALL_STATUSES, ALL_PRIORITIES } from "../config/task.config";

interface AddTaskDialogProps {
  onAddTask?: (task: Partial<Task>) => void;
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onAddTask) {
      onAddTask({
        title: title.trim(),
        status,
        priority,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        members: [],
        labels: [],
      });
    }

    setTitle("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="h-9 rounded-xl px-3.5 font-medium shadow-xs bg-primary hover:opacity-90 text-xs"
          />
        }
      >
        <Plus className="size-3.5 mr-1.5" />
        <span>Add Task</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">New Task</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new task in this workspace. (UI Mock Preview)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Task Title</label>
              <Input
                placeholder="e.g. Design Homepage Prototype"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Status</label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
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
                <label className="text-xs font-medium text-foreground">Priority</label>
                <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
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
            <Button type="submit" className="h-9 rounded-xl text-xs">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
