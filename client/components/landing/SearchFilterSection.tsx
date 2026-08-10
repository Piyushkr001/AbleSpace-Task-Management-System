"use client";

import { Calendar, Filter, ListFilter, Search, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SearchFilterSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Find the right work in seconds.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Search tasks instantly or narrow your workspace by status, priority, members, dates, labels, teams, and reporter.
          </p>
        </div>

        {/* Search & Filter UI Preview */}
        <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
          {/* Top Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-sm text-foreground">
              <Search className="size-4 text-muted-foreground" />
              <span className="flex-1 font-medium">Design Homepage</span>
              <kbd className="rounded bg-background border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-2xs">
                <Filter className="size-3.5 text-violet-500" />
                <span>Filters (3)</span>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground text-xs font-medium">Filter categories:</span>
            
            <Badge variant="outline" className="bg-background border-border/70 text-foreground font-medium py-1 px-2.5">
              Status: <span className="text-amber-500 font-semibold ml-1">In Progress</span>
            </Badge>

            <Badge variant="outline" className="bg-background border-border/70 text-foreground font-medium py-1 px-2.5">
              Priority: <span className="text-rose-500 font-semibold ml-1">High</span>
            </Badge>

            <Badge variant="outline" className="bg-background border-border/70 text-foreground font-medium py-1 px-2.5">
              Member: <span className="text-violet-500 font-semibold ml-1">Dexter</span>
            </Badge>

            <Badge variant="outline" className="bg-background border-border/70 text-foreground font-medium py-1 px-2.5">
              Due: <span className="text-foreground font-semibold ml-1">This Week</span>
            </Badge>

            <Badge variant="outline" className="bg-background border-border/70 text-foreground font-medium py-1 px-2.5">
              Label: <span className="text-foreground font-semibold ml-1">Design</span>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
