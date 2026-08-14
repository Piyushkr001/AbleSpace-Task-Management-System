"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { projectsApi } from "../api/projects.api";

export function useProject(id?: string) {
  const { isLoaded, getAuthToken } = useApiAuth();

  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("Project ID is required");
      const token = await getAuthToken();
      const res = await projectsApi.getProject(id, token);
      return res.data.project;
    },
    enabled: isLoaded && Boolean(id),
  });
}
