"use client";

import {
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  User,
  MoreHorizontal,
  Kanban,
  ListTodo,
  FolderKanban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductPreview() {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-3 shadow-sm sm:p-4 text-card-foreground">
      {/* Mock Window Topbar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground hidden sm:inline-block">
            Taskora Workspace
          </span>
        </div>

        {/* Search & Actions Mockup */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-2 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search tasks...</span>
            <kbd className="hidden rounded bg-background px-1 text-[10px] font-mono text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </div>
          <div className="flex h-7 items-center gap-1 rounded-lg border border-border/60 bg-background px-2 text-xs font-medium text-foreground">
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Filter</span>
          </div>
          <div className="flex h-7 items-center gap-1 rounded-lg bg-primary px-2 text-xs font-medium text-primary-foreground">
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Task</span>
          </div>
        </div>
      </div>

      {/* Main Mock Workspace */}
      <div className="mt-3 flex gap-3 min-h-85 sm:min-h-95">
        {/* Mock Sidebar (Desktop) */}
        <div className="hidden w-40 shrink-0 border-r border-border/50 pr-3 sm:block">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
            Views
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 rounded-lg bg-accent px-2 py-1.5 text-xs font-medium text-accent-foreground">
              <Kanban className="size-3.5 text-primary" />
              <span>Board</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50">
              <ListTodo className="size-3.5" />
              <span>List</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50">
              <FolderKanban className="size-3.5" />
              <span>Projects</span>
            </div>
          </div>

          <div className="mt-4 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
            Projects
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between px-2 py-1 hover:bg-muted/50 rounded-md">
              <span className="truncate">Taskora SaaS</span>
              <span className="text-[10px] rounded bg-muted px-1.5">12</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 hover:bg-muted/50 rounded-md">
              <span className="truncate">Mobile App</span>
              <span className="text-[10px] rounded bg-muted px-1.5">5</span>
            </div>
          </div>
        </div>

        {/* Mock Board Columns */}
        <div className="flex flex-1 gap-2 sm:gap-3 overflow-x-auto pb-2 min-w-0">
          {/* Column 1: To Do */}
          <div className="flex w-full min-w-42.5 sm:min-w-50 flex-col rounded-xl border border-border/50 bg-muted/30 p-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-foreground">To Do</span>
                <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  2
                </span>
              </div>
              <Plus className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>

            <div className="space-y-2">
              {/* Task 1 */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 shadow-2xs hover:border-border transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-medium leading-tight text-foreground">
                    Design Homepage
                  </span>
                  <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
                    High
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    Design
                  </Badge>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>18 Aug</span>
                  </div>
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    D
                  </div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 shadow-2xs hover:border-border transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-medium leading-tight text-foreground">
                    Prepare Deployment
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    Low
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    DevOps
                  </Badge>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>30 Aug</span>
                  </div>
                  <div className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                    <User className="size-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="flex w-full min-w-42.5 sm:min-w-50 flex-col rounded-xl border border-border/50 bg-muted/30 p-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-foreground">Doing</span>
                <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  1
                </span>
              </div>
              <Plus className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>

            <div className="space-y-2">
              {/* Task 3 */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 shadow-2xs hover:border-border transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-medium leading-tight text-foreground">
                    Write API Documentation
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    Medium
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    Backend
                  </Badge>
                </div>
                {/* Subtask indicator */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-3/5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">3/5</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>23 Aug</span>
                  </div>
                  <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    A
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="hidden sm:flex w-full min-w-42.5 sm:min-w-50 flex-col rounded-xl border border-border/50 bg-muted/30 p-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-foreground">Completed</span>
                <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  1
                </span>
              </div>
              <Plus className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border border-border/70 bg-background p-2.5 shadow-2xs opacity-85">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs font-medium leading-tight text-foreground line-through">
                    User Authentication
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    Security
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
