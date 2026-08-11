"use client";

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
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  fields: FieldVisibility;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, fields, onEdit, onDelete }: TaskCardProps) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <div className="group rounded-xl border border-border/60 bg-card p-3.5 shadow-2xs hover:border-border transition-all hover:shadow-xs space-y-3">
      {/* Title & Priority Header */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {task.title}
          </h4>

          <div className="flex items-center gap-1 shrink-0">
            {fields.priority && (
              <Badge
                variant="outline"
                className={cn("h-5 rounded-md px-1.5 text-[9px] font-medium border", priorityConfig.badgeStyle)}
              >
                {priorityConfig.label}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-lg text-muted-foreground hover:text-foreground opacity-80 group-hover:opacity-100"
                    aria-label="Task actions"
                  />
                }
              >
                <MoreVertical className="size-3" />
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

        {task.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Labels */}
      {fields.labels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {task.labels.map((label) => (
            <Badge
              key={label.id}
              variant="secondary"
              className="h-4.5 rounded-md px-1.5 text-[9px] font-normal bg-muted text-muted-foreground"
            >
              <Tag className="size-2.5 mr-1" />
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Card Footer: Assignees & Due Date */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-muted-foreground text-[11px]">
        {fields.members && task.members && task.members.length > 0 ? (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {task.members.map((member) => (
              <Avatar key={member.id} className="size-5 border-2 border-card">
                {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.fullName} />}
                <AvatarFallback className="text-[8px] font-semibold bg-muted text-muted-foreground">
                  {member.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <span />
        )}

        {fields.dates && task.dueDate && (
          <div className="flex items-center gap-1 text-[10px]">
            <Calendar className="size-3 text-muted-foreground" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
