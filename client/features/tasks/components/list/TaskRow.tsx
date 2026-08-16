"use client";

import Link from "next/link";
import { Calendar, MoreVertical, Edit3, Trash2, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, FieldVisibility } from "../../types/task.types";
import { TASK_PRIORITY_CONFIG } from "../../config/task.config";
import { LabelBadge } from "@/features/labels/components/LabelBadge";
import { cn } from "@/lib/utils";

interface TaskRowProps {
  task: Task;
  fields: FieldVisibility;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskRow({ task, fields, onEdit, onDelete }: TaskRowProps) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-border/50 bg-card p-3 shadow-2xs hover:border-border transition-all hover:shadow-xs">
      {/* Title & Description */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex flex-col min-w-0">
          <Link href={`/tasks/${task.id}`}>
            <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors hover:underline">
              {task.title}
            </span>
          </Link>
          {task.description && (
            <span className="text-[11px] text-muted-foreground truncate">
              {task.description}
            </span>
          )}
        </div>
      </div>

      {/* Metadata Fields & Menu */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
        {/* Priority */}
        {fields.priority && (
          <Badge
            variant="outline"
            className={cn("h-6 rounded-lg px-2 text-[10px] font-medium border", priorityConfig.badgeStyle)}
          >
            {priorityConfig.label}
          </Badge>
        )}

        {/* Assignees */}
        {fields.members && task.members && task.members.length > 0 && (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {task.members.map((member) => (
              <Avatar key={member.id} className="size-6 border-2 border-card">
                {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.fullName} />}
                <AvatarFallback className="text-[9px] font-semibold bg-muted text-muted-foreground">
                  {member.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}

        {/* Due Date */}
        {fields.dates && task.dueDate && (
          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="size-3 text-muted-foreground" />
            <span>{task.dueDate}</span>
          </div>
        )}

        {/* Labels */}
        {fields.labels && task.labels && task.labels.length > 0 && (
          <div className="flex items-center gap-1">
            {task.labels.map((label) => (
              <LabelBadge
                key={label.id}
                name={label.name}
                color={label.color}
                className="h-5 text-[10px] px-1.5"
              />
            ))}
          </div>
        )}

        {/* Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground opacity-80 group-hover:opacity-100"
                aria-label="Task actions"
              />
            }
          >
            <MoreVertical className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl p-1">
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(task)}
                className="text-xs cursor-pointer rounded-lg"
              >
                <Edit3 className="size-3.5 mr-2 text-muted-foreground" />
                <span>Edit Task</span>
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-xs cursor-pointer rounded-lg text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5 mr-2" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
