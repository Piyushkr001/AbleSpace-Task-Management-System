"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { authApi } from "@/features/auth/api/auth.api";

export function ClerkUserSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      syncedRef.current = null;
      return;
    }

    let isCancelled = false;

    const syncUser = async () => {
      // Do not re-sync if already synced for this Clerk user ID
      if (syncedRef.current === userId) return;

      try {
        const token = await getToken();
        if (!token || isCancelled) return;

        // Call explicit POST /api/auth/sync endpoint
        await authApi.syncUser(token);
        if (!isCancelled) {
          syncedRef.current = userId;
        }
      } catch (err) {
        console.error("Failed to sync Clerk user with local PostgreSQL database:", err);
      }
    };

    syncUser();

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}
