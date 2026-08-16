"use client";

import { ReactNode, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkUserSync } from "@/components/auth/ClerkUserSync";
import { AuthCacheBoundary } from "@/components/auth/AuthCacheBoundary";

interface ProviderProps {
  children: ReactNode;
}

function Provider({ children }: ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AuthCacheBoundary>
          <ClerkUserSync />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: "12px",
                  fontSize: "13px",
                  padding: "10px 16px",
                },
              }}
            />
          </ThemeProvider>
        </AuthCacheBoundary>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Provider;