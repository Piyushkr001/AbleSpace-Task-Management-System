"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductPreview } from "./ProductPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Headline & Action */}
          <div className="flex flex-1 flex-col items-start text-left max-w-2xl lg:max-w-xl">
            {/* Small badge */}
            <Badge
              variant="outline"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border-border/80 bg-muted/50 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xs"
            >
              <Sparkles className="size-3 text-violet-500" />
              <span>Organize work. Move faster.</span>
            </Badge>

            {/* Headline */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
              Bring your tasks, projects, and team into{" "}
              <span className="relative inline-block text-foreground underline decoration-violet-500/40 underline-offset-4">
                one focused workspace.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Taskora helps you plan work, organize priorities, collaborate with
              your team, and move projects forward without the clutter.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                size="lg"
                className="h-11 px-6 rounded-xl font-medium shadow-sm bg-violet-600 hover:bg-violet-700 text-white"
              >
                <span>Get Started</span>
                <ArrowRight className="size-4 ml-1" />
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                variant="outline"
                size="lg"
                className="h-11 px-6 rounded-xl font-medium border-border hover:bg-accent"
              >
                Continue as Guest
              </Button>
            </div>

            {/* Small helper text */}
            <p className="mt-3 text-xs text-muted-foreground/80">
              No complicated setup required.
            </p>
          </div>

          {/* Right Column: Interactive/Visual Product Preview */}
          <div className="flex-1 w-full min-w-0">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
