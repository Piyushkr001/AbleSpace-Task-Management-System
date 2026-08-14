"use client";

import { useState, useMemo } from "react";
import {
  AlertCircle,
  FolderKanban,
  Inbox,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { Project } from "@/features/projects/types/project.types";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { EditProjectDialog } from "@/features/projects/components/EditProjectDialog";
import { DeleteProjectDialog } from "@/features/projects/components/DeleteProjectDialog";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs text-muted-foreground">
            Organize and track tasks across dedicated workspace projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CreateProjectDialog />
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary mb-2" />
          <p className="text-xs font-medium">Loading workspace projects...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-destructive/20 bg-destructive/5 my-4 space-y-3">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Unable to load projects
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Could not retrieve workspace projects. Please check your backend connection and try again.
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

      {/* Projects Grid */}
      {!isLoading && !isError && (
        filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-4">
            <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              {searchQuery.trim() ? (
                <Inbox className="size-5" />
              ) : (
                <FolderKanban className="size-5" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {searchQuery.trim() ? "No projects match your search" : "No projects yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {searchQuery.trim()
                ? "Try searching for a different project name or clear your search."
                : "Create a project to organize tasks into meaningful initiatives."}
            </p>
            {!searchQuery.trim() && (
              <CreateProjectDialog
                trigger={
                  <Button size="sm" className="h-8 rounded-xl px-3.5 text-xs font-medium">
                    <Plus className="size-3.5 mr-1.5" />
                    <span>Create your first project</span>
                  </Button>
                }
              />
            )}
          </div>
        )
      )}

      {/* Edit & Delete Dialogs */}
      <EditProjectDialog
        project={editingProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteProjectDialog
        project={deletingProject}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
