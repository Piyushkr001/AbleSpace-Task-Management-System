"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Tag, X } from "lucide-react";
import { Task } from "../../types/task.types";
import { useLabels } from "@/features/labels/hooks/use-labels";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskLabelsFieldProps {
  task: Task;
}

export function TaskLabelsField({ task }: TaskLabelsFieldProps) {
  const { data: labels = [], isLoading, isError } = useLabels();
  const updateTaskMutation = useUpdateTask();

  const currentLabelIds = task.labels.map((l) => l.id);

  const toggleLabel = (labelId: string) => {
    if (updateTaskMutation.isPending) return;

    const nextLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter((id) => id !== labelId)
      : [...currentLabelIds, labelId];

    updateTaskMutation.mutate({
      id: task.id,
      payload: { labelIds: nextLabelIds },
    });
  };

  const handleClearAll = () => {
    if (updateTaskMutation.isPending) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { labelIds: [] },
    });
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
                <Badge
                  key={l.id}
                  variant="secondary"
                  className="h-4.5 rounded-md px-1.5 text-[9px] font-normal bg-muted text-muted-foreground"
                >
                  <Tag className="size-2.5 mr-1" />
                  {l.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs flex items-center">
              <Tag className="size-3.5 mr-1" />
              No labels
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent align="end" className="w-56 p-2 rounded-xl shadow-md">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-xs font-semibold text-foreground">Labels</span>
            {currentLabelIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={updateTaskMutation.isPending}
                className="h-6 px-1 text-[10px] text-muted-foreground hover:text-destructive"
              >
                <X className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
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
              labels.map((l) => (
                <label
                  key={l.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
                >
                  <Checkbox
                    checked={currentLabelIds.includes(l.id)}
                    disabled={updateTaskMutation.isPending}
                    onCheckedChange={() => toggleLabel(l.id)}
                  />
                  <span className="truncate text-xs">{l.name}</span>
                </label>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground px-2 py-1 block">
                No labels created yet
              </span>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
