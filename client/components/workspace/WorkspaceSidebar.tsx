"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceUserMenu } from "./WorkspaceUserMenu";

interface WorkspaceSidebarProps {
  onNavClick?: () => void;
}

export function WorkspaceSidebar({ onNavClick }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const isTasksActive = pathname === "/tasks" || pathname.startsWith("/tasks/");
  const isProjectsActive = pathname.startsWith("/projects");

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border/60 bg-sidebar/50 backdrop-blur-md p-4 text-sidebar-foreground select-none">
      {/* Workspace Brand / Logo */}
      <div className="flex items-center gap-3 px-2 py-2">
        <Link
          href="/"
          onClick={onNavClick}
          aria-label="Taskora Home"
          className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src="/Images/Logo/logo_light.svg"
            alt="Taskora"
            width={240}
            height={56}
            priority
            className="block h-10 w-auto dark:hidden"
          />
          <Image
            src="/Images/Logo/logo_dark.svg"
            alt="Taskora"
            width={240}
            height={56}
            priority
            className="hidden h-10 w-auto dark:block"
          />
        </Link>
      </div>

      {/* Workspace Label */}
      <div className="mt-4 px-2.5 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Workspace
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-1 flex-1 space-y-1" aria-label="Workspace navigation">
        {/* Tasks */}
        <Link
          href="/tasks"
          onClick={onNavClick}
          aria-current={isTasksActive ? "page" : undefined}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            isTasksActive
              ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <ListTodo
            className={cn(
              "size-4 transition-colors",
              isTasksActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <span>Tasks</span>
        </Link>

        {/* Projects */}
        <Link
          href="/tasks"
          onClick={onNavClick}
          aria-current={isProjectsActive ? "page" : undefined}
          className={cn(
            "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            isProjectsActive
              ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <FolderKanban
              className={cn(
                "size-4 transition-colors",
                isProjectsActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>Projects</span>
          </div>
          <span className="rounded-md border border-border/40 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Soon
          </span>
        </Link>
      </nav>

      {/* User Menu at Bottom */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <WorkspaceUserMenu />
      </div>
    </aside>
  );
}
