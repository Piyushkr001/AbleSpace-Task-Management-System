"use client";

import { ReactNode } from "react";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ModeToggle } from "@/app/_shared/ModeToggle";

interface WorkspaceShellProps {
  children: ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Desktop Sidebar (Fixed 240px) */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen">
        <WorkspaceSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <WorkspaceHeader />
        
        {/* Desktop Theme Switcher in Top Corner */}
        <div className="hidden md:flex justify-end px-8 pt-4 pb-0">
          <ModeToggle />
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
