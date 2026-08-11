"use client";

import { Calendar, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Task, FieldVisibility } from "../../types/task.types";
import { TASK_PRIORITY_CONFIG } from "../../config/task.config";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  fields: FieldVisibility;
}

export function TaskCard({ task, fields }: TaskCardProps) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <div className="group rounded-xl border border-border/60 bg-card p-3.5 shadow-2xs hover:border-border transition-all hover:shadow-xs space-y-3 cursor-pointer">
      {/* Title & Priority Header */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {task.title}
          </h4>

          {fields.priority && (
            <Badge
              variant="outline"
              className={cn("h-5 rounded-md px-1.5 text-[9px] font-medium shrink-0 border", priorityConfig.badgeStyle)}
            >
              {priorityConfig.label}
            </Badge>
          )}
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
                {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} />}
                <AvatarFallback className="text-[8px] font-semibold bg-muted text-muted-foreground">
                  {member.name.substring(0, 2).toUpperCase()}
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
