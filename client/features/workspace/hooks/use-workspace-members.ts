"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { workspaceApi } from "../api/workspace.api";

export function useWorkspaceMembers() {
  const { isLoaded, getAuthToken } = useApiAuth();

  return useQuery({
    queryKey: ["workspace-members"],
    queryFn: async () => {
      const token = await getAuthToken();
      const res = await workspaceApi.getMembers(token);
      return res.data.members;
    },
    enabled: isLoaded,
  });
}
