"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inbox } from "lucide-react";
import { TaskToolbar } from "@/features/tasks/components/TaskToolbar";
import { TaskListView } from "@/features/tasks/components/list/TaskListView";
import { TaskBoardView } from "@/features/tasks/components/board/TaskBoardView";
import { INITIAL_MOCK_TASKS } from "@/features/tasks/data/mock-tasks";
import { FieldVisibility, TaskFilters, Task } from "@/features/tasks/types/task.types";

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

  // Local state for mock tasks list (supports adding tasks)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_MOCK_TASKS);

  // Local state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Local state for field visibility
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

  // Add task handler (mock creation)
  const handleAddTask = (newTask: Partial<Task>) => {
    const created: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || "New Task",
      description: newTask.description || "",
      status: newTask.status || "TODO",
      priority: newTask.priority || "MEDIUM",
      members: newTask.members || [],
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      labels: newTask.labels || [],
    };
    setTasks((prev) => [created, ...prev]);
  };

  // Combined Search + Filtering Pipeline
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Filter (Title, Description, or Labels)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesLabel = task.labels?.some((l) => l.name.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesLabel) {
          return false;
        }
      }

      // 2. Status Filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }

      // 3. Priority Filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }

      // 4. Members Filter
      if (filters.memberIds.length > 0) {
        const hasMember = task.members?.some((m) => filters.memberIds.includes(m.id));
        if (!hasMember) return false;
      }

      // 5. Labels Filter
      if (filters.labelIds.length > 0) {
        const hasLabel = task.labels?.some((l) => filters.labelIds.includes(l.id));
        if (!hasLabel) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, filters]);

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
        onAddTask={handleAddTask}
      />

      {/* Content Views */}
      {filteredTasks.length > 0 ? (
        currentView === "board" ? (
          <TaskBoardView tasks={filteredTasks} fields={fields} />
        ) : (
          <TaskListView tasks={filteredTasks} fields={fields} />
        )
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-4">
          <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
            <Inbox className="size-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No tasks found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            We couldn&apos;t find any tasks matching your search or filters. Try adjusting your filter parameters or search term.
          </p>
        </div>
      )}
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
