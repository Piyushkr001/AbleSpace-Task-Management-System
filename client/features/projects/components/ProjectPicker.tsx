"use client";

import { useState } from "react";
import { FolderKanban, Check, ChevronDown, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "../hooks/use-projects";
import { cn } from "@/lib/utils";

interface ProjectPickerProps {
  value?: string | null;
  onChange: (projectId: string | null) => void;
  disabled?: boolean;
  variant?: "select" | "popover";
  placeholder?: string;
}

export function ProjectPicker({
  value,
  onChange,
  disabled = false,
  variant = "select",
  placeholder = "Select project",
}: ProjectPickerProps) {
  const { data: projects = [], isLoading, isError } = useProjects();
  const [open, setOpen] = useState(false);

  const selectedProject = projects.find((p) => p.id === value);

  if (variant === "select") {
    return (
      <Select
        value={value ?? "none"}
        onValueChange={(val) => {
          onChange(val === "none" ? null : val);
        }}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="h-9 rounded-xl text-xs">
          <div className="flex items-center gap-2 truncate">
            <FolderKanban className="size-3.5 text-primary shrink-0" />
            <SelectValue placeholder={isLoading ? "Loading projects..." : placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="none" className="text-xs text-muted-foreground">
            No Project
          </SelectItem>
          {isLoading ? (
            <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
              Loading projects...
            </div>
          ) : isError ? (
            <div className="px-2 py-1.5 text-xs text-destructive">
              Unable to load projects
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="truncate">{project.name}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              No projects created yet
            </div>
          )}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || isLoading}
            className="h-8 border-none bg-transparent hover:bg-accent/50 rounded-xl px-2 text-xs font-medium w-auto"
          />
        }
      >
        <div className="flex items-center gap-1.5">
          {selectedProject ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <FolderKanban className="size-3.5 text-primary" />
              <span className="truncate max-w-35">{selectedProject.name}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center">
              <FolderKanban className="size-3.5 mr-1 text-muted-foreground" />
              {placeholder}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-2 rounded-xl shadow-md">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs font-semibold text-foreground">Project</span>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              disabled={disabled}
              className="h-6 px-1 text-[10px] text-muted-foreground hover:text-destructive"
            >
              <X className="size-3 mr-1" />
              Remove
            </Button>
          )}
        </div>

        <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
              Loading projects...
            </div>
          ) : isError ? (
            <span className="text-[11px] text-destructive px-2 py-1 block">
              Unable to load projects
            </span>
          ) : projects.length > 0 ? (
            projects.map((proj) => {
              const isSelected = proj.id === value;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    onChange(isSelected ? null : proj.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderKanban className="size-3.5 shrink-0" />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {isSelected && <Check className="size-3.5 shrink-0 text-primary" />}
                </button>
              );
            })
          ) : (
            <span className="text-[11px] text-muted-foreground px-2 py-1 block">
              No projects created yet
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
