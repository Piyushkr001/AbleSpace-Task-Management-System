"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

export function MobileWorkspaceNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-xl border-border/80 md:hidden"
            aria-label="Open workspace navigation"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>

      <SheetContent side="left" className="w-68 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Workspace Navigation</SheetTitle>
        </SheetHeader>
        <div className="h-full">
          <WorkspaceSidebar onNavClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
