"use client";

import Link from "next/link";
import { FolderKanban, MoreVertical, Edit3, Trash2, ArrowUpRight, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/70 p-5 shadow-2xs hover:border-border hover:shadow-xs transition-all duration-200">
      {/* Top row: Icon, Name & Menu */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-3 min-w-0 flex-1 group/title"
          >
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/title:bg-primary/20 transition-colors">
              <FolderKanban className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate group-hover/title:text-primary transition-colors flex items-center gap-1.5">
                <span>{project.name}</span>
                <ArrowUpRight className="size-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/title:opacity-100 transition-all text-muted-foreground" />
              </h3>
              <p className="text-[11px] text-muted-foreground">Created {formattedDate}</p>
            </div>
          </Link>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-label="Project actions"
                >
                  <MoreVertical className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-36 rounded-xl text-xs">
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onEdit?.(project)}
              >
                <Edit3 className="size-3.5" />
                <span>Rename / Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => onDelete?.(project)}
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-8 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer / Stats */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">{project.taskCount}</span>
          <span className="text-muted-foreground">
            {project.taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="text-[11px] font-medium text-primary hover:underline"
        >
          View project &rarr;
        </Link>
      </div>
    </div>
  );
}
