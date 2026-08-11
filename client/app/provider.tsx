"use client";

import React, { ReactNode, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkUserSync } from "@/components/auth/ClerkUserSync";

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
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Provider;