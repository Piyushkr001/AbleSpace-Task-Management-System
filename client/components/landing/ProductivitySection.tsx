"use client";

import { Calendar, CheckCircle2, ChevronRight, MessageSquare, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductivitySection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Product Visual: Simplified Task Detail Mockup */}
          <div className="w-full flex-1 min-w-0 order-2 lg:order-1">
            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs text-card-foreground">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Taskora SaaS</span>
                  <ChevronRight className="size-3" />
                  <span className="font-medium text-foreground">TASK-104</span>
                </div>
                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px]">
                  High Priority
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                  Write API Documentation
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Comprehensive documentation for all REST API endpoints and webhooks.
                </p>
              </div>

              {/* Metadata Fields */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs">
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block">Status</span>
                  <div className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span>In Progress</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block">Due Date</span>
                  <div className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    <span>23 Aug 2026</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block">Assignee</span>
                  <div className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                    <div className="flex size-4 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-bold">
                      A
                    </div>
                    <span>Ankit Sharma</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block">Labels</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded bg-background px-1.5 py-0.5 border border-border/60 text-[10px] font-medium text-foreground">
                      API
                    </span>
                    <span className="rounded bg-background px-1.5 py-0.5 border border-border/60 text-[10px] font-medium text-foreground">
                      Backend
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtasks Mockup */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                  <span>Subtasks</span>
                  <span className="text-muted-foreground font-mono text-[11px]">2 of 3 done</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="line-through">Draft endpoint definitions</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="line-through">Set up OpenAPI specification</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-xs text-foreground font-medium">
                    <div className="size-3.5 rounded-full border border-border/80 shrink-0" />
                    <span>Add authentication examples & code snippets</span>
                  </div>
                </div>
              </div>

              {/* Discussion preview */}
              <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-muted-foreground" />
                  <span>3 comments</span>
                </div>
                <span>Updated 2h ago</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 max-w-xl order-1 lg:order-2 text-left">
            <Badge
              variant="outline"
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
            >
              Everything in context
            </Badge>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-tight">
              Every task carries the information your team needs.
            </h2>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Keep priorities, dates, teammates, subtasks, labels, resources, and updates connected to the work itself.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Keep task details in one place",
                "Break larger work into subtasks",
                "Collaborate through comments and updates",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <CheckCircle2 className="size-4 text-violet-500 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
