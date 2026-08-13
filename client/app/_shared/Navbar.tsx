"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LayoutDashboard, LogOut, Menu } from "lucide-react";

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
import { authApi } from "@/features/auth/api/auth.api";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn: isClerkSignedIn } = useUser();
  const clerk = useClerk();
  const [isGuestSignedIn, setIsGuestSignedIn] = useState(false);

  // Check if a Guest session cookie exists on backend
  useEffect(() => {
    let isMounted = true;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (isMounted && res?.data?.user) {
          setIsGuestSignedIn(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsGuestSignedIn(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const isAuthenticated = Boolean(isClerkSignedIn || isGuestSignedIn);

  const handleLogout = async () => {
    try {
      if (isClerkSignedIn) {
        await clerk.signOut();
      }
      if (isGuestSignedIn) {
        await authApi.logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      queryClient.clear();
      setIsGuestSignedIn(false);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      router.replace("/");
      router.refresh();
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 transition-all">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            aria-label="Taskora home"
            className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-[1.01]"
          >
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
          <ul className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1 shadow-2xs">
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
                      "relative rounded-lg px-4 font-medium text-muted-foreground transition-all duration-200",
                      "hover:bg-background/80 hover:text-foreground",
                      active &&
                        "bg-background text-foreground shadow-xs hover:bg-background font-semibold"
                    )}
                  >
                    {link.label}

                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ModeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/tasks" />}
                className="h-10 rounded-xl px-5 font-medium shadow-xs bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 hover:opacity-95 transition-opacity"
              >
                <LayoutDashboard className="size-4 mr-2" />
                <span>Go to Workspace</span>
                <ArrowRight className="size-3.5 ml-1.5 opacity-80" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-10 rounded-xl px-3 text-muted-foreground hover:text-foreground border-border/80"
                title="Log out"
              >
                <LogOut className="size-4 mr-1.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              nativeButton={false}
              render={<Link href="/login" />}
              className="h-10 rounded-xl px-5 font-medium shadow-xs bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 hover:opacity-95 transition-opacity"
            >
              Login
            </Button>
          )}
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
                  className="rounded-xl border-border/80"
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
              <SheetHeader className="border-b border-border/60 px-5 py-5 text-left">
                <SheetTitle className="sr-only">
                  Taskora Navigation
                </SheetTitle>

                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Taskora home"
                  className="inline-flex w-fit items-center"
                >
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
                                    ? "bg-accent text-accent-foreground font-semibold"
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

                <div className="mt-auto border-t border-border/60 pt-5 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Button
                            nativeButton={false}
                            render={<Link href="/tasks" />}
                            className="h-11 w-full rounded-xl font-medium bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600"
                          />
                        }
                      >
                        <span className="flex items-center justify-center">
                          <LayoutDashboard className="size-4 mr-2" />
                          <span>Go to Workspace</span>
                        </span>
                      </SheetClose>

                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="h-11 w-full rounded-xl font-medium text-muted-foreground hover:text-foreground border-border/80"
                      >
                        <LogOut className="size-4 mr-2" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Button
                          nativeButton={false}
                          render={<Link href="/login" />}
                          className="h-11 w-full rounded-xl font-medium bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600"
                        />
                      }
                    >
                      Login
                    </SheetClose>
                  )}
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