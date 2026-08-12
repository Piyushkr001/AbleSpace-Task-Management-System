"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Users, X } from "lucide-react";
import { Task } from "../../types/task.types";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace-members";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskMembersFieldProps {
  task: Task;
}

export function TaskMembersField({ task }: TaskMembersFieldProps) {
  const { data: workspaceMembers = [], isLoading, isError } = useWorkspaceMembers();
  const updateTaskMutation = useUpdateTask();

  const currentMemberIds = task.members.map((m) => m.id);

  const toggleMember = (memberId: string) => {
    if (updateTaskMutation.isPending) return;

    const nextMemberIds = currentMemberIds.includes(memberId)
      ? currentMemberIds.filter((id) => id !== memberId)
      : [...currentMemberIds, memberId];

    updateTaskMutation.mutate({
      id: task.id,
      payload: { memberIds: nextMemberIds },
    });
  };

  const handleClearAll = () => {
    if (updateTaskMutation.isPending) return;

    updateTaskMutation.mutate({
      id: task.id,
      payload: { memberIds: [] },
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground">Assignees</span>

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
          {task.members.length > 0 ? (
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {task.members.map((m) => (
                <Avatar key={m.id} className="size-5 border-2 border-card">
                  {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt={m.fullName} />}
                  <AvatarFallback className="text-[8px] font-semibold bg-muted text-muted-foreground">
                    {m.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs flex items-center">
              <Users className="size-3.5 mr-1" />
              Unassigned
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent align="end" className="w-56 p-2 rounded-xl shadow-md">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-xs font-semibold text-foreground">Assignees</span>
            {currentMemberIds.length > 0 && (
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
                Loading members...
              </div>
            ) : isError ? (
              <span className="text-[11px] text-destructive px-2 py-1 block">
                Unable to load members
              </span>
            ) : workspaceMembers.length > 0 ? (
              workspaceMembers.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
                >
                  <Checkbox
                    checked={currentMemberIds.includes(m.id)}
                    disabled={updateTaskMutation.isPending}
                    onCheckedChange={() => toggleMember(m.id)}
                  />
                  <Avatar className="size-5 border border-border/40 shrink-0">
                    {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt={m.fullName} />}
                    <AvatarFallback className="text-[8px] font-semibold">
                      {m.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs">{m.fullName}</span>
                </label>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground px-2 py-1 block">
                No members found
              </span>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
