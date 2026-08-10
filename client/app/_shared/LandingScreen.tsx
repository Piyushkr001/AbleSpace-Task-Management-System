import { HeroSection } from "@/components/landing/HeroSection";
import { ValueStrip } from "@/components/landing/ValueStrip";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { ProductivitySection } from "@/components/landing/ProductivitySection";
import { ProjectsSection } from "@/components/landing/ProjectsSection";
import { SearchFilterSection } from "@/components/landing/SearchFilterSection";
import { AppearanceSection } from "@/components/landing/AppearanceSection";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden selection:bg-violet-500/20 selection:text-violet-600 dark:selection:text-violet-400">
      <main className="flex-1">
        <HeroSection />
        <ValueStrip />
        <FeaturesSection />
        <WorkflowSection />
        <ProductivitySection />
        <ProjectsSection />
        <SearchFilterSection />
        <AppearanceSection />
        <CTASection />
      </main>
    </div>
  );
}