import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "./provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Taskora",
  description: "Plan. Organize. Get things done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
