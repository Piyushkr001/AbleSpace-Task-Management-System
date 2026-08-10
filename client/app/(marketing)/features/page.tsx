import { FeaturesSection } from "@/components/landing/FeaturesSection";

export const metadata = {
  title: "Features | Taskora",
  description: "Explore Taskora features for task and project management",
};

export default function FeaturesPage() {
  return (
    <div className="py-8">
      <FeaturesSection />
    </div>
  );
}
