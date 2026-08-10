"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { authApi } from "@/features/auth/api/auth.api";

export function ClerkUserSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      syncedRef.current = null;
      return;
    }

    let isCancelled = false;

    const syncUser = async () => {
      try {
        const token = await getToken();
        if (!token || isCancelled) return;

        if (syncedRef.current === token) return;
        syncedRef.current = token;

        await authApi.getCurrentUser(token);
      } catch (err) {
        console.error("Failed to sync Clerk user with local PostgreSQL database:", err);
      }
    };

    syncUser();

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
