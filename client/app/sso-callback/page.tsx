"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">
          Completing sign in...
        </p>
      </div>
      <div id="clerk-captcha" />
      <AuthenticateWithRedirectCallback
        signUpForceRedirectUrl="/tasks"
        signInForceRedirectUrl="/tasks"
      />
    </div>
  );
}
