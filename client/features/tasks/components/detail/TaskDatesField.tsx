"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "../../types/task.types";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskDatesFieldProps {
  task: Task;
}

function TaskDatesFieldForm({ task }: TaskDatesFieldProps) {
  const [startDate, setStartDate] = useState(task.startDate || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateTaskMutation = useUpdateTask();

  const hasChanged =
    (startDate || null) !== (task.startDate || null) ||
    (dueDate || null) !== (task.dueDate || null);

  const handleSave = () => {
    const s = startDate || null;
    const d = dueDate || null;

    if (s && d && new Date(s) > new Date(d)) {
      setErrorMessage("Start date cannot be after due date");
      return;
    }
    setErrorMessage(null);

    updateTaskMutation.mutate(
      {
        id: task.id,
        payload: {
          startDate: s,
          dueDate: d,
        },
      },
      {
        onError: (err) => {
          setErrorMessage(err.message || "Failed to update dates");
        },
      }
    );
  };

  const handleCancel = () => {
    setStartDate(task.startDate || "");
    setDueDate(task.dueDate || "");
    setErrorMessage(null);
  };

  const handleClearStart = () => {
    setStartDate("");
    setErrorMessage(null);
  };

  const handleClearDue = () => {
    setDueDate("");
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2 py-1.5 border-b border-border/40">
      {/* Start Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Start Date</span>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setErrorMessage(null);
            }}
            className="h-7 text-xs rounded-lg px-2 border-none bg-transparent hover:bg-accent/50 w-32"
          />
          {startDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearStart}
              className="size-6 rounded-md text-muted-foreground hover:text-destructive"
              aria-label="Clear start date"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Due Date</span>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setErrorMessage(null);
            }}
            className="h-7 text-xs rounded-lg px-2 border-none bg-transparent hover:bg-accent/50 w-32"
          />
          {dueDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearDue}
              className="size-6 rounded-md text-muted-foreground hover:text-destructive"
              aria-label="Clear due date"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="text-[11px] text-destructive leading-tight px-0.5">
          {errorMessage}
        </p>
      )}

      {/* Action buttons when modified */}
      {hasChanged && (
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={updateTaskMutation.isPending}
            className="h-6 px-2 text-[11px] rounded-md text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={updateTaskMutation.isPending}
            className="h-6 px-2.5 text-[11px] rounded-md font-medium"
          >
            <Check className="size-3 mr-1" />
            {updateTaskMutation.isPending ? "Saving..." : "Save Dates"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function TaskDatesField({ task }: TaskDatesFieldProps) {
  return (
    <TaskDatesFieldForm
      key={`${task.id}-${task.startDate || ""}-${task.dueDate || ""}`}
      task={task}
    />
  );
}
