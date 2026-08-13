"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./GoogleIcon";
import { useAuthCache } from "@/components/auth/AuthCacheBoundary";
import { authApi } from "@/features/auth/api/auth.api";

export default function TaskoraLogin() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const { establishPrincipal } = useAuthCache();

  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already signed in with Clerk, automatically redirect to /tasks
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/tasks");
    }
  }, [isSignedIn, router]);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    setError(null);

    try {
      const res = await authApi.guestLogin();
      if (res?.data?.user?.id) {
        establishPrincipal(`guest:${res.data.user.id}`);
      }
      toast.success("Signed in as Guest");
      router.replace("/tasks");
      router.refresh();
    } catch (err) {
      console.error("Guest login error:", err);
      setError("Unable to start a guest session. Please try again.");
      toast.error("Unable to start guest session");
      setIsGuestLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSignedIn) {
      router.replace("/tasks");
      return;
    }

    if (!clerk || !clerk.client) {
      setError("Authentication system is initializing. Please try again in a moment.");
      return;
    }

    setIsGoogleLoading(true);
    setError(null);

    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/tasks",
      });
    } catch (err: unknown) {
      console.error("Clerk Google login error:", err);
      const errorObj = err as { message?: string; errors?: Array<{ message?: string }> };
      const msg = errorObj?.message || errorObj?.errors?.[0]?.message || "";
      if (msg.toLowerCase().includes("already signed in")) {
        router.replace("/tasks");
        return;
      }
      setError("Unable to continue with Google. Please try again.");
      toast.error("Google authentication failed");
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

        {/* Clerk CAPTCHA Container for custom flows */}
        <div id="clerk-captcha" />

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
