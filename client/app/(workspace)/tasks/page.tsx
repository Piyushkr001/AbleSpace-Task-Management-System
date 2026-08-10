export const metadata = {
  title: "Tasks | Taskora Workspace",
  description: "Manage your tasks and projects",
};

export default function TasksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md text-center space-y-3 rounded-2xl border border-border/80 bg-card p-8 shadow-xs">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Taskora Workspace
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This page will be replaced later by the exact AbleSpace Figma Tasks interface.
        </p>
      </div>
    </main>
  );
}
