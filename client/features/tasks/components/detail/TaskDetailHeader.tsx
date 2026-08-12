"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Edit2, MoreVertical, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "../../types/task.types";
import { useUpdateTask } from "../../hooks/use-update-task";

interface TaskDetailHeaderProps {
  task: Task;
  onDeleteClick?: () => void;
}

export function TaskDetailHeader({ task, onDeleteClick }: TaskDetailHeaderProps) {
  const updateTaskMutation = useUpdateTask();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);

  const handleSaveTitle = () => {
    if (!titleValue.trim() || titleValue.trim() === task.title) {
      setTitleValue(task.title);
      setIsEditingTitle(false);
      return;
    }

    updateTaskMutation.mutate(
      {
        id: task.id,
        payload: { title: titleValue.trim() },
      },
      {
        onSuccess: () => {
          setIsEditingTitle(false);
        },
      }
    );
  };

  const handleCancelTitle = () => {
    setTitleValue(task.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="space-y-3 pb-4 border-b border-border/60">
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between gap-2">
        <Link href="/tasks">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            <span>Back to Tasks</span>
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="Task options"
              />
            }
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1">
            <DropdownMenuItem
              onClick={() => setIsEditingTitle(true)}
              className="text-xs cursor-pointer rounded-lg"
            >
              <Edit2 className="size-3.5 mr-2 text-muted-foreground" />
              <span>Edit Title</span>
            </DropdownMenuItem>
            {onDeleteClick && (
              <DropdownMenuItem
                onClick={onDeleteClick}
                className="text-xs cursor-pointer rounded-lg text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5 mr-2" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editable Title Section */}
      <div className="pt-1">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className="text-lg font-semibold h-10 rounded-xl flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") handleCancelTitle();
              }}
            />
            <Button
              size="icon"
              variant="default"
              onClick={handleSaveTitle}
              disabled={updateTaskMutation.isPending}
              className="size-9 rounded-xl shrink-0"
              aria-label="Save title"
            >
              <Check className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCancelTitle}
              className="size-9 rounded-xl shrink-0"
              aria-label="Cancel title edit"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="group flex items-center gap-2">
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground cursor-pointer hover:text-primary transition-colors leading-tight"
            >
              {task.title}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingTitle(true)}
              className="size-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              aria-label="Edit title"
            >
              <Edit2 className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
