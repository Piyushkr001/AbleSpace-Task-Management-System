"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Plus, Subtitles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Task } from "../../types/task.types";
import { useTasks } from "../../hooks/use-tasks";
import { useCreateTask } from "../../hooks/use-create-task";
import { useUpdateTask } from "../../hooks/use-update-task";
import { TASK_PRIORITY_CONFIG } from "../../config/task.config";
import { cn } from "@/lib/utils";

interface TaskSubtasksProps {
  task: Task;
}

export function TaskSubtasks({ task }: TaskSubtasksProps) {
  const { data: subtasks = [], isLoading } = useTasks({ parentTaskId: task.id });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTaskMutation.mutate(
      {
        title: newTitle.trim(),
        parentTaskId: task.id,
      },
      {
        onSuccess: () => {
          setNewTitle("");
          setIsAdding(false);
        },
      }
    );
  };

  const handleToggleCompleted = (e: React.MouseEvent, subtask: Task) => {
    e.stopPropagation();
    e.preventDefault();

    const nextStatus = subtask.status === "COMPLETED" ? "TODO" : "COMPLETED";
    updateTaskMutation.mutate({
      id: subtask.id,
      payload: { status: nextStatus },
    });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Subtitles className="size-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Subtasks
          </h3>
          {subtasks.length > 0 && (
            <Badge variant="secondary" className="h-4.5 rounded-md px-1.5 text-[10px]">
              {subtasks.filter((s) => s.status === "COMPLETED").length} / {subtasks.length}
            </Badge>
          )}
        </div>

        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3.5 mr-1" />
            <span>Add Subtask</span>
          </Button>
        )}
      </div>

      {/* Subtasks List */}
      <div className="space-y-1.5">
        {isLoading ? (
          <p className="text-xs text-muted-foreground py-2">Loading subtasks...</p>
        ) : subtasks.length > 0 ? (
          subtasks.map((subtask) => {
            const isCompleted = subtask.status === "COMPLETED";
            const priorityConfig = TASK_PRIORITY_CONFIG[subtask.priority];

            return (
              <Link key={subtask.id} href={`/tasks/${subtask.id}`}>
                <div className="group flex items-center justify-between gap-2.5 rounded-xl border border-border/40 bg-background p-2.5 hover:border-border transition-all hover:shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleCompleted(e, subtask)}
                      className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      aria-label={isCompleted ? "Mark incomplete" : "Mark completed"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-4 text-primary fill-primary/10" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </button>

                    <span
                      className={cn(
                        "text-xs font-medium truncate transition-colors",
                        isCompleted
                          ? "line-through text-muted-foreground"
                          : "text-foreground group-hover:text-primary"
                      )}
                    >
                      {subtask.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {subtask.priority !== "NONE" && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-4.5 rounded-md px-1.5 text-[9px] font-medium border",
                          priorityConfig.badgeStyle
                        )}
                      >
                        {priorityConfig.label}
                      </Badge>
                    )}
                    {subtask.dueDate && (
                      <span className="text-[10px] text-muted-foreground">{subtask.dueDate}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          !isAdding && (
            <p className="text-xs text-muted-foreground italic py-1">
              No subtasks created. Click &quot;Add Subtask&quot; to create one.
            </p>
          )
        )}
      </div>

      {/* Add Subtask Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
          <Input
            placeholder="Subtask title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="h-8 text-xs rounded-xl bg-background"
            autoFocus
          />
          <Button
            type="submit"
            size="sm"
            disabled={createTaskMutation.isPending || !newTitle.trim()}
            className="h-8 rounded-xl text-xs shrink-0"
          >
            {createTaskMutation.isPending ? "Adding..." : "Add"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setNewTitle("");
              setIsAdding(false);
            }}
            className="h-8 rounded-xl text-xs shrink-0"
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}
