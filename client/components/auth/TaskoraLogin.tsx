"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./GoogleIcon";
import { authApi } from "@/features/auth/api/auth.api";

export default function TaskoraLogin() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn() as unknown as {
    isLoaded: boolean;
    signIn: {
      sso?: (params: Record<string, string>) => Promise<void>;
      authenticateWithRedirect: (params: Record<string, string>) => Promise<void>;
    };
  };

  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    setError(null);

    try {
      await authApi.guestLogin();
      router.replace("/tasks");
      router.refresh();
    } catch (err) {
      console.error("Guest login error:", err);
      setError("Unable to start a guest session. Please try again.");
      setIsGuestLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded || !signIn) {
      setError("Authentication system is initializing. Please try again in a moment.");
      return;
    }

    setIsGoogleLoading(true);
    setError(null);

    try {
      if (typeof signIn.sso === "function") {
        await signIn.sso({
          strategy: "oauth_google",
          redirectCallbackUrl: "/sso-callback",
          redirectUrl: "/tasks",
        });
      } else {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/tasks",
        });
      }
    } catch (err) {
      console.error("Clerk Google login error:", err);
      setError("Unable to continue with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const isLoading = isGuestLoading || isGoogleLoading;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-6 py-10 text-foreground">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Taskora Logo */}
        <Link
          href="/"
          aria-label="Taskora home"
          className="inline-flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            src="/Images/Logo/logo_light.svg"
            alt="Taskora"
            width={300}
            height={72}
            priority
            className="block h-14 w-auto dark:hidden"
          />
          <Image
            src="/Images/Logo/logo_dark.svg"
            alt="Taskora"
            width={300}
            height={72}
            priority
            className="hidden h-14 w-auto dark:block"
          />
        </Link>

        {/* Heading & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
            Let&apos;s get back on track
          </h1>
          <p className="text-sm text-muted-foreground leading-6">
            Continue as a guest or sign in with your Google account.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="w-full rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive text-center"
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-1">
          {/* Guest Login */}
          <Button
            size="lg"
            className="h-11 w-full rounded-lg text-sm font-medium shadow-xs"
            disabled={isLoading}
            onClick={handleGuestLogin}
          >
            {isGuestLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Continuing...</span>
              </>
            ) : (
              "Continue as Guest"
            )}
          </Button>

          {/* Google Login */}
          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full rounded-lg text-sm font-medium border-border/80 hover:bg-accent"
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="size-4 mr-2" />
                <span>Login with Google</span>
              </>
            )}
          </Button>
        </div>

        {/* Terms & Privacy */}
        <p className="text-xs text-muted-foreground leading-relaxed pt-2">
          By continuing, you agree to Taskora&apos;s{" "}
          <Link
            href="/terms"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
