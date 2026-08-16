"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckSquare,
  Edit3,
  FolderKanban,
  Inbox,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskToolbar } from "@/features/tasks/components/TaskToolbar";
import { TaskListView } from "@/features/tasks/components/list/TaskListView";
import { TaskBoardView } from "@/features/tasks/components/board/TaskBoardView";
import { EditTaskDialog } from "@/features/tasks/components/EditTaskDialog";
import { DeleteTaskDialog } from "@/features/tasks/components/DeleteTaskDialog";
import { AddTaskDialog } from "@/features/tasks/components/AddTaskDialog";
import { FieldVisibility, TaskFilters, Task } from "@/features/tasks/types/task.types";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useProject } from "@/features/projects/hooks/use-project";
import { EditProjectDialog } from "@/features/projects/components/EditProjectDialog";
import { DeleteProjectDialog } from "@/features/projects/components/DeleteProjectDialog";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Project details
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProject,
  } = useProject(projectId);

  // Project edit/delete dialog states
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  // View state: list vs board (?view=list|board) with strict validation
  const currentView: "list" | "board" = searchParams.get("view") === "board" ? "board" : "list";

  const handleViewChange = (view: "list" | "board") => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("view", view);
    router.replace(`/projects/${projectId}?${nextParams.toString()}`);
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

  // Field visibility state
  const [fields, setFields] = useState<FieldVisibility>({
    priority: true,
    members: true,
    dates: true,
    labels: true,
  });

  // Filters state
  const [filters, setFilters] = useState<TaskFilters>({
    statuses: [],
    priorities: [],
    memberIds: [],
    labelIds: [],
  });

  // Task edit & delete dialog states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

  // Tasks query scoped to this project
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
    refetch: refetchTasks,
  } = useTasks({
    projectId,
    search: debouncedSearch || undefined,
    status: filters.statuses.length > 0 ? filters.statuses : undefined,
    priority: filters.priorities.length > 0 ? filters.priorities : undefined,
    memberId: filters.memberIds.length > 0 ? filters.memberIds : undefined,
    labelId: filters.labelIds.length > 0 ? filters.labelIds : undefined,
  });

  const hasActiveFilters = Boolean(
    debouncedSearch.trim() ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.memberIds.length > 0 ||
      filters.labelIds.length > 0
  );

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteTaskOpen(true);
  };

  // Loading State
  if (isProjectLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary mb-2" />
        <p className="text-xs font-medium">Loading project details...</p>
      </div>
    );
  }

  // Error / Not Found State
  if (isProjectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto text-center p-6 space-y-4">
        <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Project Unavailable</h2>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            This project could not be found or you do not have permission to view it.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/projects")}
            className="h-8 rounded-xl text-xs"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            <span>Back to Projects</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => refetchProject()}
            className="h-8 rounded-xl text-xs"
          >
            <RefreshCw className="size-3 mr-1.5" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Banner */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <FolderKanban className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
                  {project.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="h-5 rounded-md px-2 text-[10px] font-medium">
                    {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
                  </Badge>
                  {hasActiveFilters && (
                    <Badge variant="outline" className="h-5 rounded-md px-2 text-[10px] font-medium text-muted-foreground border-border/70">
                      Showing {tasks.length} after filters
                    </Badge>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl pt-0.5">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Created {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Project Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProjectOpen(true)}
              className="h-8 rounded-xl px-3 text-xs"
            >
              <Edit3 className="size-3.5 mr-1.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteProjectOpen(true)}
              className="h-8 rounded-xl px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Task Section Header & Toolbar */}
      <div className="space-y-1 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="size-4 text-primary" />
            <span>Project Tasks</span>
          </h2>
        </div>

        <TaskToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentView={currentView}
          onViewChange={handleViewChange}
          fields={fields}
          onFieldsChange={setFields}
          filters={filters}
          onFiltersChange={setFilters}
          defaultProjectId={projectId}
        />
      </div>

      {/* Tasks Loading State */}
      {isTasksLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary mb-2" />
          <p className="text-xs">Loading tasks for {project.name}...</p>
        </div>
      )}

      {/* Tasks Error State */}
      {!isTasksLoading && isTasksError && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-destructive/20 bg-destructive/5 my-4 space-y-3">
          <div className="size-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">Unable to load project tasks</h3>
            <p className="text-[11px] text-muted-foreground max-w-sm mt-1">
              Could not retrieve tasks for this project. Please try again.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchTasks()}
            className="h-7 rounded-xl text-xs"
          >
            <RefreshCw className="size-3 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Tasks Content */}
      {!isTasksLoading && !isTasksError && (
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
          /* Project Tasks Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-4">
            <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Inbox className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {hasActiveFilters ? "No tasks match your filters" : "No tasks in this project yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Add tasks to plan and execute work under this project."}
            </p>
            {!hasActiveFilters && (
              <AddTaskDialog
                defaultProjectId={projectId}
                trigger={
                  <Button size="sm" className="h-8 rounded-xl px-3.5 text-xs font-medium">
                    <Plus className="size-3.5 mr-1.5" />
                    <span>Add Task to Project</span>
                  </Button>
                }
              />
            )}
          </div>
        )
      )}

      {/* Edit & Delete Project Dialogs */}
      <EditProjectDialog
        project={project}
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
      />
      <DeleteProjectDialog
        project={project}
        open={isDeleteProjectOpen}
        onOpenChange={setIsDeleteProjectOpen}
        onDeleted={() => router.push("/projects")}
      />

      {/* Edit & Delete Task Dialogs */}
      <EditTaskDialog
        key={editingTask?.id || "edit-task-dialog"}
        task={editingTask}
        open={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
      />
      <DeleteTaskDialog
        task={deletingTask}
        open={isDeleteTaskOpen}
        onOpenChange={setIsDeleteTaskOpen}
      />
    </div>
  );
}
