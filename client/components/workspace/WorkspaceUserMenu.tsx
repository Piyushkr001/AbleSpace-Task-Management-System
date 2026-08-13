"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authApi } from "@/features/auth/api/auth.api";

interface LocalUserData {
  fullName: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
}

export function WorkspaceUserMenu() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const queryClient = useQueryClient();

  const [guestUser, setGuestUser] = useState<LocalUserData | null>(null);

  useEffect(() => {
    if (clerkUser) return;

    let isMounted = true;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (isMounted && res?.data?.user) {
          setGuestUser({
            fullName: res.data.user.fullName,
            avatarUrl: res.data.user.avatarUrl,
            isGuest: res.data.user.isGuest,
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [clerkUser]);

  const userName = clerkUser?.fullName || clerkUser?.firstName || guestUser?.fullName || "User";
  const avatarUrl = clerkUser?.imageUrl || guestUser?.avatarUrl || undefined;
  const isGuest = !clerkUser && Boolean(guestUser?.isGuest);

  const handleLogout = async () => {
    try {
      if (clerkUser) {
        await clerk.signOut();
      }
      await authApi.logout();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    }
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar className="size-8 rounded-lg border border-border/50">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
          <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            {initials || <UserIcon className="size-4" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 text-left">
          <span className="truncate text-xs font-semibold text-foreground">
            {userName}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {isGuest ? "Guest Access" : "Member"}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="size-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
        title="Log out"
      >
        <LogOut className="size-3.5" />
      </Button>
    </div>
  );
}
