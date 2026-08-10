import { CheckCircle2, FolderKanban, LayoutDashboard, Users } from "lucide-react";

const valueItems = [
  {
    icon: CheckCircle2,
    label: "Focused workflows",
  },
  {
    icon: LayoutDashboard,
    label: "Flexible task views",
  },
  {
    icon: FolderKanban,
    label: "Project organization",
  },
  {
    icon: Users,
    label: "Team collaboration",
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-muted-foreground">
          {valueItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <Icon className="size-4 text-violet-500" />
                <span className="text-foreground/90">{item.label}</span>
                {index < valueItems.length - 1 && (
                  <span aria-hidden="true" className="ml-6 sm:ml-10 hidden sm:inline text-border font-light">
                    •
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
