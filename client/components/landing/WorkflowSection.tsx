import { CheckCircle2, PlayCircle, Plus, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    stepNumber: "01",
    title: "Capture",
    description: "Create a task the moment work appears.",
    icon: Plus,
  },
  {
    stepNumber: "02",
    title: "Organize",
    description: "Set priority, dates, labels, members, and project context.",
    icon: SlidersHorizontal,
  },
  {
    stepNumber: "03",
    title: "Execute",
    description: "Move work through your board or manage everything from List view.",
    icon: PlayCircle,
  },
  {
    stepNumber: "04",
    title: "Complete",
    description: "Track progress, finish subtasks, and keep project work moving.",
    icon: CheckCircle2,
  },
];

export function WorkflowSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            From idea to done, without losing context.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A simple 4-step workflow that keeps your team synchronized and productive.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-2xs hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground">
                    <Icon className="size-5 text-violet-500" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Subtle desktop connector arrow indicator */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full border border-border/60 bg-background text-muted-foreground text-[10px] items-center justify-center shadow-2xs"
                  >
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
