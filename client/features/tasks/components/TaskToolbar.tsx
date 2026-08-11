"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskFieldsPopover } from "./TaskFieldsPopover";
import { TaskFilterPopover } from "./TaskFilterPopover";
import { AddTaskDialog } from "./AddTaskDialog";
import { FieldVisibility, TaskFilters, Task } from "../types/task.types";
import { cn } from "@/lib/utils";

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: "list" | "board";
  onViewChange: (view: "list" | "board") => void;
  fields: FieldVisibility;
  onFieldsChange: (fields: FieldVisibility) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onAddTask?: (task: Partial<Task>) => void;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  currentView,
  onViewChange,
  fields,
  onFieldsChange,
  filters,
  onFiltersChange,
  onAddTask,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-4">
      {/* Search & Actions Group */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Input */}
        <div className="relative min-w-48 max-w-xs flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-8 pr-3 text-xs rounded-xl border-border/80 bg-background"
          />
        </div>

        {/* Fields Popover */}
        <TaskFieldsPopover fields={fields} onChange={onFieldsChange} />

        {/* Filter Popover */}
        <TaskFilterPopover filters={filters} onChange={onFiltersChange} />

        {/* Add Task Button */}
        <AddTaskDialog onAddTask={onAddTask} />
      </div>

      {/* View Switch (List / Board) */}
      <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/40 p-1 self-start sm:self-auto shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("list")}
          className={cn(
            "h-7 rounded-lg px-2.5 text-xs font-medium transition-all",
            currentView === "list"
              ? "bg-background text-foreground shadow-2xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <List className="size-3.5 mr-1.5" />
          <span>List</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("board")}
          className={cn(
            "h-7 rounded-lg px-2.5 text-xs font-medium transition-all",
            currentView === "board"
              ? "bg-background text-foreground shadow-2xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="size-3.5 mr-1.5" />
          <span>Board</span>
        </Button>
      </div>
    </div>
  );
}
