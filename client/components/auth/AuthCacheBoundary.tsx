"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";

interface AuthCacheContextType {
  principalId: string | null;
  isPrincipalLoaded: boolean;
  refreshPrincipal: () => Promise<void>;
  clearPrincipalCache: () => void;
}

const AuthCacheContext = createContext<AuthCacheContextType>({
  principalId: null,
  isPrincipalLoaded: false,
  refreshPrincipal: async () => {},
  clearPrincipalCache: () => {},
});

export const useAuthCache = () => useContext(AuthCacheContext);

interface AuthCacheBoundaryProps {
  children: ReactNode;
}

export function AuthCacheBoundary({ children }: AuthCacheBoundaryProps) {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, userId: clerkUserId } = useAuth();
  const queryClient = useQueryClient();

  const [principalId, setPrincipalId] = useState<string | null>(null);
  const [isPrincipalLoaded, setIsPrincipalLoaded] = useState(false);
  const activePrincipalRef = useRef<string | null>(null);

  const clearPrincipalCache = () => {
    queryClient.clear();
    activePrincipalRef.current = null;
    setPrincipalId(null);
  };

  const applyPrincipalChange = (newPrincipal: string | null) => {
    if (
      activePrincipalRef.current !== null &&
      activePrincipalRef.current !== newPrincipal
    ) {
      queryClient.clear();
    }
    activePrincipalRef.current = newPrincipal;
    setPrincipalId(newPrincipal);
  };

  const resolvePrincipal = async () => {
    if (!isClerkLoaded) return;

    if (isClerkSignedIn && clerkUserId) {
      const newPrincipal = `clerk:${clerkUserId}`;
      applyPrincipalChange(newPrincipal);
      setIsPrincipalLoaded(true);
      return;
    }

    try {
      const res = await authApi.getCurrentUser();
      if (res?.data?.user) {
        const newPrincipal = `guest:${res.data.user.id}`;
        applyPrincipalChange(newPrincipal);
      } else {
        applyPrincipalChange(null);
      }
    } catch {
      applyPrincipalChange(null);
    } finally {
      setIsPrincipalLoaded(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!isClerkLoaded) return;

    const syncAuth = async () => {
      if (isClerkSignedIn && clerkUserId) {
        const newPrincipal = `clerk:${clerkUserId}`;
        if (
          activePrincipalRef.current !== null &&
          activePrincipalRef.current !== newPrincipal
        ) {
          queryClient.clear();
        }
        activePrincipalRef.current = newPrincipal;
        if (isMounted) {
          setPrincipalId(newPrincipal);
          setIsPrincipalLoaded(true);
        }
        return;
      }

      try {
        const res = await authApi.getCurrentUser();
        if (!isMounted) return;
        if (res?.data?.user) {
          const newPrincipal = `guest:${res.data.user.id}`;
          if (
            activePrincipalRef.current !== null &&
            activePrincipalRef.current !== newPrincipal
          ) {
            queryClient.clear();
          }
          activePrincipalRef.current = newPrincipal;
          setPrincipalId(newPrincipal);
        } else {
          if (activePrincipalRef.current !== null) {
            queryClient.clear();
          }
          activePrincipalRef.current = null;
          setPrincipalId(null);
        }
      } catch {
        if (!isMounted) return;
        if (activePrincipalRef.current !== null) {
          queryClient.clear();
        }
        activePrincipalRef.current = null;
        setPrincipalId(null);
      } finally {
        if (isMounted) {
          setIsPrincipalLoaded(true);
        }
      }
    };

    syncAuth();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isClerkSignedIn, clerkUserId, queryClient]);

  return (
    <AuthCacheContext.Provider
      value={{
        principalId,
        isPrincipalLoaded,
        refreshPrincipal: resolvePrincipal,
        clearPrincipalCache,
      }}
    >
      {children}
    </AuthCacheContext.Provider>
  );
}
