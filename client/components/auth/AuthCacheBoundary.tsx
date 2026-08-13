"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api-client";

export interface AuthCacheContextType {
  principalId: string | null;
  isPrincipalLoaded: boolean;
  hasServerError: boolean;
  establishPrincipal: (newPrincipalId: string) => void;
  clearPrincipal: () => void;
  refreshPrincipal: () => Promise<void>;
}

const AuthCacheContext = createContext<AuthCacheContextType>({
  principalId: null,
  isPrincipalLoaded: false,
  hasServerError: false,
  establishPrincipal: () => {},
  clearPrincipal: () => {},
  refreshPrincipal: async () => {},
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
  const [hasServerError, setHasServerError] = useState(false);
  const activePrincipalRef = useRef<string | null>(null);

  const establishPrincipal = useCallback(
    (newPrincipalId: string) => {
      if (
        activePrincipalRef.current !== null &&
        activePrincipalRef.current !== newPrincipalId
      ) {
        queryClient.clear();
      }
      activePrincipalRef.current = newPrincipalId;
      setPrincipalId(newPrincipalId);
      setIsPrincipalLoaded(true);
      setHasServerError(false);
    },
    [queryClient]
  );

  const clearPrincipal = useCallback(() => {
    queryClient.clear();
    activePrincipalRef.current = null;
    setPrincipalId(null);
    setIsPrincipalLoaded(true);
    setHasServerError(false);
  }, [queryClient]);

  const refreshPrincipal = useCallback(async () => {
    if (!isClerkLoaded) return;

    if (isClerkSignedIn && clerkUserId) {
      establishPrincipal(`clerk:${clerkUserId}`);
      return;
    }

    try {
      const res = await authApi.getCurrentUser();
      if (res?.data?.user) {
        establishPrincipal(`guest:${res.data.user.id}`);
      } else {
        clearPrincipal();
      }
    } catch (err: unknown) {
      const status = (err as ApiError)?.status ?? (err as { status?: number })?.status;
      if (status === 401) {
        clearPrincipal();
      } else {
        setHasServerError(true);
        setIsPrincipalLoaded(true);
      }
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUserId, establishPrincipal, clearPrincipal]);

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
          setHasServerError(false);
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
          setHasServerError(false);
        } else {
          if (activePrincipalRef.current !== null) {
            queryClient.clear();
          }
          activePrincipalRef.current = null;
          setPrincipalId(null);
          setHasServerError(false);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const status = (err as ApiError)?.status ?? (err as { status?: number })?.status;
        if (status === 401) {
          if (activePrincipalRef.current !== null) {
            queryClient.clear();
          }
          activePrincipalRef.current = null;
          setPrincipalId(null);
          setHasServerError(false);
        } else {
          setHasServerError(true);
        }
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
        hasServerError,
        establishPrincipal,
        clearPrincipal,
        refreshPrincipal,
      }}
    >
      {children}
    </AuthCacheContext.Provider>
  );
}
