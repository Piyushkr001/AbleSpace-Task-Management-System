"use client";

import { Laptop, Moon, Sun, Check } from "lucide-react";

const themeOptions = [
  { name: "Light", icon: Sun, active: true },
  { name: "Dark", icon: Moon, active: false },
  { name: "System", icon: Laptop, active: false },
];

const accentColors = [
  { name: "Violet", bg: "bg-violet-500", active: true },
  { name: "Amber", bg: "bg-amber-500", active: false },
  { name: "Blue", bg: "bg-blue-500", active: false },
  { name: "Rose", bg: "bg-rose-500", active: false },
  { name: "Emerald", bg: "bg-emerald-500", active: false },
  { name: "Black", bg: "bg-zinc-900 dark:bg-zinc-100", active: false },
];

export function AppearanceSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            A workspace that feels like yours.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Switch between light and dark appearance modes and personalize Taskora with your preferred accent.
          </p>
        </div>

        {/* Customization Preview Card */}
        <div className="mt-10 mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-6">
          {/* Theme selector preview */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              Appearance Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium cursor-pointer transition-all ${
                      item.active
                        ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                        : "border-border/70 bg-background text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accent Color Swatches preview */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              Accent Color
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {accentColors.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:border-border"
                >
                  <span className={`size-3.5 rounded-full ${color.bg} flex items-center justify-center`}>
                    {color.active && <Check className="size-2.5 text-white" />}
                  </span>
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
