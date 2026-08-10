import type { Metadata } from "next";
import { Exo_2, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskora",
  description: "Plan. Organize. Get things done.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", exo2.className, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
