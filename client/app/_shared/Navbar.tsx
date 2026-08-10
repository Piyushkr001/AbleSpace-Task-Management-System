"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/75">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            aria-label="Taskora home"
            className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* Logo unchanged */}
            <Image
              src="/Images/Logo/logo_light.svg"
              alt="Taskora"
              width={300}
              height={72}
              priority
              className="block h-14 w-auto dark:hidden"
            />

            <Image
              src="/Images/Logo/logo_dark.svg"
              alt="Taskora"
              width={300}
              height={72}
              priority
              className="hidden h-14 w-auto dark:block"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center md:flex">
          <ul className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <li key={link.href}>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                      />
                    }
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "relative rounded-lg px-4 font-medium text-muted-foreground transition-colors",
                      "hover:bg-background hover:text-foreground",
                      active &&
                        "bg-background text-foreground shadow-sm hover:bg-background"
                    )}
                  >
                    {link.label}

                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-4 -bottom-1.5 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <ModeToggle />

          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="h-10 rounded-xl px-5 font-medium shadow-sm bg-linear-to-br from-violet-500 via-purple-500 to-violet-600"
          >
            Login
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-75 flex-col p-0 sm:w-85"
            >
              <SheetHeader className="border-b px-5 py-5 text-left">
                <SheetTitle className="sr-only">
                  Taskora Navigation
                </SheetTitle>

                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Taskora home"
                  className="inline-flex w-fit items-center"
                >
                  {/* Logo unchanged */}
                  <Image
                    src="/Images/Logo/logo_light.svg"
                    alt="Taskora"
                    width={300}
                    height={72}
                    priority
                    className="block h-14 w-auto dark:hidden"
                  />

                  <Image
                    src="/Images/Logo/logo_dark.svg"
                    alt="Taskora"
                    width={300}
                    height={72}
                    priority
                    className="hidden h-14 w-auto dark:block"
                  />
                </Link>
              </SheetHeader>

              {/* Mobile Navigation */}
              <div className="flex flex-1 flex-col px-4 py-6">
                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const active = isActiveLink(link.href);

                      return (
                        <li key={link.href}>
                          <SheetClose
                            nativeButton={false}
                            render={
                              <Link
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                  "flex h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors",
                                  active
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                )}
                              />
                            }
                          >
                            {link.label}
                          </SheetClose>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-auto border-t pt-5">
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Button
                        nativeButton={false}
                        render={<Link href="/login" />}
                        className="h-11 w-full rounded-xl font-medium"
                      />
                    }
                  >
                    Login
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;