"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Inbox, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskToolbar } from "@/features/tasks/components/TaskToolbar";
import { TaskListView } from "@/features/tasks/components/list/TaskListView";
import { TaskBoardView } from "@/features/tasks/components/board/TaskBoardView";
import { EditTaskDialog } from "@/features/tasks/components/EditTaskDialog";
import { DeleteTaskDialog } from "@/features/tasks/components/DeleteTaskDialog";
import { FieldVisibility, TaskFilters, Task } from "@/features/tasks/types/task.types";
import { useTasks } from "@/features/tasks/hooks/use-tasks";

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state for List vs Board view (?view=list|board)
  const currentView = (searchParams.get("view") as "list" | "board") || "list";

  const handleViewChange = (view: "list" | "board") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`/tasks?${params.toString()}`);
  };

  // Search input & debounced search term (250ms)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Local state for field visibility (Frontend-only UI preference)
  const [fields, setFields] = useState<FieldVisibility>({
    priority: true,
    members: true,
    dates: true,
    labels: true,
  });

  // Local state for filters
  const [filters, setFilters] = useState<TaskFilters>({
    statuses: [],
    priorities: [],
    memberIds: [],
    labelIds: [],
  });

  // Edit / Delete dialog state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Determine if any filters are active
  const hasActiveFilters = Boolean(
    debouncedSearch.trim() ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.memberIds.length > 0 ||
      filters.labelIds.length > 0
  );

  // TanStack Query hook calling backend API (GET /api/tasks)
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useTasks({
    search: debouncedSearch || undefined,
    status: filters.statuses.length > 0 ? filters.statuses : undefined,
    priority: filters.priorities.length > 0 ? filters.priorities : undefined,
    memberId: filters.memberIds.length > 0 ? filters.memberIds : undefined,
    labelId: filters.labelIds.length > 0 ? filters.labelIds : undefined,
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Tasks
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage, filter, and organize your workspace tasks.
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <TaskToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onViewChange={handleViewChange}
        fields={fields}
        onFieldsChange={setFields}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary mb-2" />
          <p className="text-xs font-medium">Loading tasks from workspace...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-destructive/20 bg-destructive/5 my-4 space-y-3">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Unable to load tasks</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Could not retrieve workspace tasks. Please check your backend connection and try again.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 rounded-xl text-xs"
          >
            <RefreshCw className="size-3 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Content Views */}
      {!isLoading && !isError && (
        tasks.length > 0 ? (
          currentView === "board" ? (
            <TaskBoardView
              tasks={tasks}
              fields={fields}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              fields={fields}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-4">
            <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Inbox className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Create your first task to get started."}
            </p>
          </div>
        )
      )}

      {/* Edit & Delete Dialogs */}
      <EditTaskDialog
        key={editingTask?.id || "edit-dialog"}
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteTaskDialog
        task={deletingTask}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-xs text-muted-foreground">
          Loading tasks...
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
