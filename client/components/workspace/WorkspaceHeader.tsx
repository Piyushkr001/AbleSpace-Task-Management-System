"use client";

import { ModeToggle } from "@/app/_shared/ModeToggle";
import { MobileWorkspaceNav } from "./MobileWorkspaceNav";

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2">
        <MobileWorkspaceNav />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Taskora Workspace
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
