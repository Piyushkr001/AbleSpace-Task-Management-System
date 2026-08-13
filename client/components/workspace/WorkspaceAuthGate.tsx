"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthCache } from "@/components/auth/AuthCacheBoundary";
import { authApi } from "@/features/auth/api/auth.api";

interface WorkspaceAuthGateProps {
  children: ReactNode;
}

export function WorkspaceAuthGate({ children }: WorkspaceAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const { principalId, isPrincipalLoaded, refreshPrincipal, clearPrincipalCache } = useAuthCache();

  const [hasServerError, setHasServerError] = useState(false);

  const checkAuth = async () => {
    setHasServerError(false);
    try {
      await refreshPrincipal();
    } catch {
      setHasServerError(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!isClerkLoaded || !isPrincipalLoaded) return;

    const checkGuestAuth = async () => {
      if (isClerkSignedIn) {
        if (isMounted) setHasServerError(false);
        return;
      }

      try {
        const res = await authApi.getCurrentUser();
        if (!isMounted) return;
        if (res?.data?.user) {
          setHasServerError(false);
        } else {
          clearPrincipalCache();
          router.replace("/login");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const status = (err as { status?: number })?.status;
        if (status === 401) {
          clearPrincipalCache();
          router.replace("/login");
        } else {
          setHasServerError(true);
        }
      }
    };

    checkGuestAuth();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isClerkSignedIn, isPrincipalLoaded, principalId, pathname, router, clearPrincipalCache]);

  const isAuthenticated = Boolean(isClerkSignedIn || principalId);
  const isLoading = !isClerkLoaded || !isPrincipalLoaded;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (hasServerError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="max-w-md w-full text-center space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div className="mx-auto size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Workspace Temporarily Unavailable</h3>
            <p className="text-xs text-muted-foreground">
              Unable to connect to the authentication server. Please check your connection and try again.
            </p>
          </div>
          <Button
            onClick={checkAuth}
            className="h-9 rounded-xl px-4 text-xs font-medium"
          >
            <RefreshCw className="size-3.5 mr-2" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
