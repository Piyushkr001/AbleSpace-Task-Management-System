"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";

interface WorkspaceAuthGateProps {
  children: ReactNode;
}

export function WorkspaceAuthGate({ children }: WorkspaceAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (!isClerkLoaded) return;

      // 1. If Clerk is authenticated, allow immediately
      if (isClerkSignedIn) {
        if (isMounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
        return;
      }

      // 2. Otherwise check Guest session cookie on NestJS backend
      try {
        const res = await authApi.getCurrentUser();
        if (isMounted) {
          if (res?.data?.user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.replace("/login");
          }
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.replace("/login");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isClerkSignedIn, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
