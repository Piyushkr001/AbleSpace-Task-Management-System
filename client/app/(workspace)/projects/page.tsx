import { FolderKanban } from "lucide-react";

export const metadata = {
  title: "Projects | Taskora Workspace",
  description: "Manage projects in your workspace",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
      <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <FolderKanban className="size-6" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Projects Management
      </h1>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        Project grouping and management features will be available in the next workspace update.
      </p>
    </div>
  );
}
