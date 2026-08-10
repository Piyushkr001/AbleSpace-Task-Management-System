import { apiClient } from "@/lib/api-client";

export interface UserResponse {
  data: {
    user: {
      id: string;
      fullName: string | null;
      email: string | null;
      avatarUrl: string | null;
      isGuest: boolean;
    };
  };
}

export interface MessageResponse {
  message: string;
}

export const authApi = {
  guestLogin: () =>
    apiClient<UserResponse>("/auth/guest", {
      method: "POST",
    }),

  getCurrentUser: (token?: string) =>
    apiClient<UserResponse>("/auth/me", {
      method: "GET",
      token,
    }),

  logout: () =>
    apiClient<MessageResponse>("/auth/logout", {
      method: "POST",
    }),
};
