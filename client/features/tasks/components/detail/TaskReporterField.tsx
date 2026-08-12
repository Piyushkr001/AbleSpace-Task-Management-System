"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Task } from "../../types/task.types";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace-members";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskReporterFieldProps {
  task: Task;
}

export function TaskReporterField({ task }: TaskReporterFieldProps) {
  const { data: workspaceMembers = [] } = useWorkspaceMembers();
  const updateTaskMutation = useUpdateTask();

  const handleReporterChange = (val: string | null) => {
    const newReporterId = !val || val === "none" ? null : val;
    if (newReporterId === task.reporter?.id) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { reporterId: newReporterId },
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground">Reporter</span>

      <div className="flex items-center gap-1">
        <Select
          value={task.reporter?.id || "none"}
          onValueChange={(val: string | null) => handleReporterChange(val)}
        >
          <SelectTrigger className="h-8 border-none bg-transparent hover:bg-accent/50 rounded-xl px-2 text-xs font-medium w-auto focus:ring-0">
            <SelectValue>
              {task.reporter ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-4 border border-border/40">
                    {task.reporter.avatarUrl && (
                      <AvatarImage src={task.reporter.avatarUrl} alt={task.reporter.fullName} />
                    )}
                    <AvatarFallback className="text-[7px] font-semibold">
                      {task.reporter.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate max-w-28">{task.reporter.fullName}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No reporter</span>
              )}
            </SelectValue>
          </SelectTrigger>

          <SelectContent align="end" className="rounded-xl">
            <SelectItem value="none" className="text-xs text-muted-foreground cursor-pointer">
              No reporter
            </SelectItem>
            {workspaceMembers.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-xs cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-4 border border-border/40">
                    {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt={m.fullName} />}
                    <AvatarFallback className="text-[7px] font-semibold">
                      {m.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{m.fullName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {task.reporter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleReporterChange("none")}
            className="size-6 rounded-md text-muted-foreground hover:text-destructive"
            aria-label="Clear reporter"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
