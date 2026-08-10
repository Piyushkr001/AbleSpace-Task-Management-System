"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/80 bg-card p-8 sm:p-14 text-center shadow-xs">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Ready to put your work back in focus?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Start organizing tasks and projects in one clean, professional workspace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/login" />}
              size="lg"
              className="h-11 px-8 rounded-xl font-medium shadow-sm bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/login" />}
              variant="outline"
              size="lg"
              className="h-11 px-8 rounded-xl font-medium border-border hover:bg-accent w-full sm:w-auto"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
