"use client";

import { useState } from "react";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "../../types/task.types";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskDescriptionProps {
  task: Task;
}

export function TaskDescription({ task }: TaskDescriptionProps) {
  const updateTaskMutation = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);
  const [descValue, setDescValue] = useState(task.description || "");

  const handleSave = () => {
    const cleanDesc = descValue.trim();
    const finalDesc = cleanDesc.length > 0 ? cleanDesc : null;

    updateTaskMutation.mutate(
      {
        id: task.id,
        payload: { description: finalDesc },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleClear = () => {
    updateTaskMutation.mutate(
      {
        id: task.id,
        payload: { description: null },
      },
      {
        onSuccess: () => {
          setDescValue("");
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setDescValue(task.description || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-2 rounded-2xl border border-border/50 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </h3>

        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="size-3 mr-1" />
            <span>Edit</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-1">
          <Textarea
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            placeholder="Add task description..."
            className="text-xs rounded-xl min-h-28 bg-background"
          />

          <div className="flex items-center justify-between gap-2">
            {task.description && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={updateTaskMutation.isPending}
                className="h-8 rounded-xl px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3 mr-1.5" />
                Clear Description
              </Button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8 rounded-xl text-xs"
              >
                <X className="size-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateTaskMutation.isPending}
                className="h-8 rounded-xl text-xs"
              >
                <Check className="size-3.5 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed cursor-pointer rounded-xl p-1 hover:bg-accent/40 transition-colors min-h-8 flex items-center"
        >
          {task.description ? (
            task.description
          ) : (
            <span className="text-muted-foreground italic">No description provided. Click to add one...</span>
          )}
        </div>
      )}
    </div>
  );
}
