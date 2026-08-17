"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Tag, X, Check } from "lucide-react";
import { Task } from "../../types/task.types";
import { useLabels, useCreateLabel } from "@/features/labels/hooks/use-labels";
import { LabelBadge, PRESET_LABEL_COLORS } from "@/features/labels/components/LabelBadge";
import { useUpdateTask } from "../../hooks/use-update-task";
import { cn } from "@/lib/utils";

interface TaskLabelsFieldProps {
  task: Task;
}

export function TaskLabelsField({ task }: TaskLabelsFieldProps) {
  const { data: labels = [], isLoading, isError } = useLabels();
  const updateTaskMutation = useUpdateTask();
  const createLabelMutation = useCreateLabel();

  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(PRESET_LABEL_COLORS[0].value);

  const currentLabelIds = task.labels.map((l) => l.id);

  const toggleLabel = (labelId: string) => {
    if (updateTaskMutation.isPending || createLabelMutation.isPending) return;

    const currentIds = task.labels.map((l) => l.id);
    const nextLabelIds = currentIds.includes(labelId)
      ? currentIds.filter((id) => id !== labelId)
      : [...currentIds, labelId];

    updateTaskMutation.mutate({
      id: task.id,
      payload: { labelIds: nextLabelIds },
    });
  };

  const handleClearAll = () => {
    if (updateTaskMutation.isPending || createLabelMutation.isPending) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { labelIds: [] },
    });
  };

  const handleCreateLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newLabelName.trim();
    if (!cleanName) return;

    createLabelMutation.mutate(
      {
        name: cleanName,
        color: newLabelColor,
      },
      {
        onSuccess: (newLabel) => {
          // Immediately attach newly created label to current task
          const currentIds = task.labels.map((l) => l.id);
          updateTaskMutation.mutate({
            id: task.id,
            payload: { labelIds: [...currentIds, newLabel.id] },
          });
          setNewLabelName("");
          setIsCreating(false);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground">Labels</span>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              disabled={updateTaskMutation.isPending}
              className="h-8 border-none bg-transparent hover:bg-accent/50 rounded-xl px-2 text-xs font-medium w-auto"
            />
          }
        >
          {task.labels.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              {task.labels.map((l) => (
                <LabelBadge key={l.id} name={l.name} color={l.color} />
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs flex items-center">
              <Tag className="size-3.5 mr-1" />
              No labels
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent align="end" className="w-64 p-2.5 rounded-xl shadow-md space-y-2">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-border/40">
            <span className="text-xs font-semibold text-foreground">Labels</span>
            <div className="flex items-center gap-1">
              {currentLabelIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={updateTaskMutation.isPending}
                  className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Labels List */}
          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-0.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Loading labels...
              </div>
            ) : isError ? (
              <span className="text-[11px] text-destructive px-2 py-1 block">
                Unable to load labels
              </span>
            ) : labels.length > 0 ? (
              labels.map((l) => {
                const isChecked = currentLabelIds.includes(l.id);
                return (
                  <label
                    key={l.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Checkbox
                        checked={isChecked}
                        disabled={updateTaskMutation.isPending}
                        onCheckedChange={() => toggleLabel(l.id)}
                      />
                      <span className="truncate text-xs">{l.name}</span>
                    </div>
                    {l.color && (
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                    )}
                  </label>
                );
              })
            ) : (
              <span className="text-[11px] text-muted-foreground px-2 py-1 block">
                No labels created yet
              </span>
            )}
          </div>

          {/* Inline Create Label Section */}
          <div className="pt-1 border-t border-border/40">
            {!isCreating ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="w-full h-7 rounded-lg text-xs font-medium justify-start text-primary hover:text-primary hover:bg-primary/10 px-2"
              >
                <Plus className="size-3.5 mr-1.5" />
                <span>Create new label</span>
              </Button>
            ) : (
              <form onSubmit={handleCreateLabel} className="space-y-2 pt-1">
                <div className="space-y-1">
                  <Input
                    placeholder="Label name..."
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    maxLength={50}
                    autoFocus
                    className="h-7 text-xs rounded-lg px-2"
                    required
                  />
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-1 justify-between px-1">
                  {PRESET_LABEL_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      onClick={() => setNewLabelColor(c.value)}
                      className={cn(
                        "size-4 rounded-full flex items-center justify-center transition-transform",
                        newLabelColor === c.value && "ring-2 ring-primary ring-offset-1 scale-110"
                      )}
                      style={{ backgroundColor: c.value }}
                    >
                      {newLabelColor === c.value && (
                        <Check className="size-2.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false);
                      setNewLabelName("");
                    }}
                    className="h-6 text-[10px] rounded-md px-2 flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newLabelName.trim() || createLabelMutation.isPending}
                    className="h-6 text-[10px] rounded-md px-2 flex-1"
                  >
                    {createLabelMutation.isPending ? "Creating..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
