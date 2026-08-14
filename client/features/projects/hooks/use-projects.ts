"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { projectsApi } from "../api/projects.api";

export function useProjects() {
  const { isLoaded, getAuthToken } = useApiAuth();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await getAuthToken();
      const res = await projectsApi.getProjects(token);
      return res.data.projects;
    },
    enabled: isLoaded,
  });
}
