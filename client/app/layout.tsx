import type { Metadata } from "next";
import { Exo_2, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./_shared/Navbar";
import Footer from "./_shared/Footer";
import Provider from "./provider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", exo2.className, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
