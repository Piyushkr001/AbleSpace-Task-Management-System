"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api/projects.api";
import { CreateProjectInput } from "../types/project.types";

export function useCreateProject() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectInput) => {
      const token = await getAuthToken();
      const res = await projectsApi.createProject(payload, token);
      return res.data.project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`Project "${project.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
}
