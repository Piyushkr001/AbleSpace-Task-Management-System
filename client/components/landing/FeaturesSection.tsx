import {
  ClipboardCheck,
  Columns3,
  FolderKanban,
  ListFilter,
  ListTodo,
  Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Columns3,
    title: "Kanban Boards",
    description:
      "Move work through clear stages and understand progress at a glance.",
  },
  {
    icon: ListTodo,
    title: "List View",
    description:
      "Review tasks in a structured view with priority, members, dates, and status.",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    description:
      "Keep related tasks together and track important project work from one place.",
  },
  {
    icon: ListFilter,
    title: "Smart Filters",
    description:
      "Find the exact work you need using status, priority, members, labels, and dates.",
  },
  {
    icon: ClipboardCheck,
    title: "Task Details",
    description:
      "Keep descriptions, subtasks, resources, labels, dates, and discussions connected to each task.",
  },
  {
    icon: Palette,
    title: "Flexible Appearance",
    description:
      "Work comfortably with light and dark modes and personalized accent colors.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Everything you need to keep work moving
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed sm:text-lg">
            From individual tasks to complete projects, Taskora gives your
            workspace a clear structure without unnecessary complexity.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border border-border/70 bg-card p-6 rounded-xl shadow-2xs hover:border-border/90 hover:shadow-xs transition-all duration-200"
              >
                <CardHeader className="p-0 gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-foreground group-hover:border-violet-500/30 group-hover:bg-violet-500/10 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
