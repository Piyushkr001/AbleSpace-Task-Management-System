"use client";

import { FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    name: "Design Homepage",
    priority: "High",
    priorityVariant: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    lead: "Dexter",
    leadInitials: "D",
    dueDate: "18 Aug",
    progress: 75,
    tasksCount: "8/10",
  },
  {
    name: "Backend API",
    priority: "Medium",
    priorityVariant: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    lead: "Ankit",
    leadInitials: "A",
    dueDate: "23 Aug",
    progress: 50,
    tasksCount: "6/12",
  },
  {
    name: "Deployment",
    priority: "Low",
    priorityVariant: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    lead: "Team",
    leadInitials: "T",
    dueDate: "30 Aug",
    progress: 20,
    tasksCount: "2/10",
  },
];

export function ProjectsSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Keep tasks connected to the bigger picture.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Create projects, assign priorities and leads, track due dates, and manage related tasks without leaving your workspace.
          </p>
        </div>

        {/* Project Table / Card Container */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <FolderKanban className="size-4 text-violet-500" />
              <span>Active Workspace Projects</span>
            </div>
            <span className="text-xs text-muted-foreground">3 Projects</span>
          </div>

          {/* Table Container for Responsiveness */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-125">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Lead</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {projects.map((proj) => (
                  <tr key={proj.name} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{proj.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{proj.tasksCount} tasks completed</div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${proj.priorityVariant}`}>
                        {proj.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {proj.leadInitials}
                        </div>
                        <span className="text-xs">{proj.lead}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-25">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-xs text-muted-foreground">
                      {proj.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
