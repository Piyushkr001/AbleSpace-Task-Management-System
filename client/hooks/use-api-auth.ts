"use client";

import { useAuth } from "@clerk/nextjs";

export function useApiAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const getAuthToken = async (): Promise<string | undefined> => {
    if (isLoaded && isSignedIn) {
      const token = await getToken();
      return token || undefined;
    }
    return undefined;
  };

  return {
    isLoaded,
    isSignedIn,
    getAuthToken,
  };
}
