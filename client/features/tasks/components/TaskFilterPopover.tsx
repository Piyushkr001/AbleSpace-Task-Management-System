"use client";

import { ListFilter, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TaskFilters, TaskStatus, TaskPriority } from "../types/task.types";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, ALL_STATUSES, ALL_PRIORITIES } from "../config/task.config";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace-members";
import { useLabels } from "@/features/labels/hooks/use-labels";

interface TaskFilterPopoverProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function TaskFilterPopover({ filters, onChange }: TaskFilterPopoverProps) {
  const { data: members = [], isLoading: isMembersLoading, isError: isMembersError } = useWorkspaceMembers();
  const { data: labels = [], isLoading: isLabelsLoading, isError: isLabelsError } = useLabels();

  const activeCount =
    filters.statuses.length +
    filters.priorities.length +
    filters.memberIds.length +
    filters.labelIds.length;

  const toggleStatus = (status: TaskStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  };

  const togglePriority = (priority: TaskPriority) => {
    const next = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    onChange({ ...filters, priorities: next });
  };

  const toggleMember = (memberId: string) => {
    const next = filters.memberIds.includes(memberId)
      ? filters.memberIds.filter((m) => m !== memberId)
      : [...filters.memberIds, memberId];
    onChange({ ...filters, memberIds: next });
  };

  const toggleLabel = (labelId: string) => {
    const next = filters.labelIds.includes(labelId)
      ? filters.labelIds.filter((l) => l !== labelId)
      : [...filters.labelIds, labelId];
    onChange({ ...filters, labelIds: next });
  };

  const clearAll = () => {
    onChange({
      statuses: [],
      priorities: [],
      memberIds: [],
      labelIds: [],
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl px-3 border-border/80 text-xs font-medium relative"
          />
        }
      >
        <ListFilter className="size-3.5 mr-1.5 text-muted-foreground" />
        <span>Filter</span>
        {activeCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-1.5 h-4 rounded-full px-1.5 text-[10px] font-semibold bg-primary/10 text-primary"
          >
            {activeCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-3 shadow-md rounded-xl max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-1 pb-1">
          <h4 className="text-xs font-semibold text-foreground">Filter Tasks</h4>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-destructive"
            >
              <X className="size-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <Separator className="my-1.5" />

        {/* Status Filter */}
        <div className="py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Status
          </span>
          <div className="mt-1 space-y-0.5">
            {ALL_STATUSES.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
              >
                <Checkbox
                  checked={filters.statuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <span>{TASK_STATUS_CONFIG[status].label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-1.5" />

        {/* Priority Filter */}
        <div className="py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Priority
          </span>
          <div className="mt-1 space-y-0.5">
            {ALL_PRIORITIES.map((priority) => (
              <label
                key={priority}
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
              >
                <Checkbox
                  checked={filters.priorities.includes(priority)}
                  onCheckedChange={() => togglePriority(priority)}
                />
                <span>{TASK_PRIORITY_CONFIG[priority].label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-1.5" />

        {/* Members Filter */}
        <div className="py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Members
          </span>
          <div className="mt-1 space-y-0.5">
            {isMembersLoading ? (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Loading members...
              </div>
            ) : isMembersError ? (
              <span className="text-[11px] text-destructive px-2 py-1 block">
                Unable to load members
              </span>
            ) : members.length > 0 ? (
              members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
                >
                  <Checkbox
                    checked={filters.memberIds.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                  <span className="truncate">{member.fullName}</span>
                </label>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground px-2 py-1 block">
                No members found
              </span>
            )}
          </div>
        </div>

        <Separator className="my-1.5" />

        {/* Labels Filter */}
        <div className="py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Labels
          </span>
          <div className="mt-1 space-y-0.5">
            {isLabelsLoading ? (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Loading labels...
              </div>
            ) : isLabelsError ? (
              <span className="text-[11px] text-destructive px-2 py-1 block">
                Unable to load labels
              </span>
            ) : labels.length > 0 ? (
              labels.map((label) => (
                <label
                  key={label.id}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-accent text-xs cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Checkbox
                      checked={filters.labelIds.includes(label.id)}
                      onCheckedChange={() => toggleLabel(label.id)}
                    />
                    <span className="truncate">{label.name}</span>
                  </div>
                  {label.color && (
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: label.color }}
                    />
                  )}
                </label>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground px-2 py-1 block">
                No labels found
              </span>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
