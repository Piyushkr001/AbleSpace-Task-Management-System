import Navbar from "@/app/_shared/Navbar";
import Footer from "@/app/_shared/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-violet-500/20 selection:text-violet-600 dark:selection:text-violet-400">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
