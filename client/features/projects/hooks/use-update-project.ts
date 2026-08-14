"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api/projects.api";
import { UpdateProjectInput } from "../types/project.types";

export function useUpdateProject() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProjectInput }) => {
      const token = await getAuthToken();
      const res = await projectsApi.updateProject(id, payload, token);
      return res.data.project;
    },
    onSuccess: (project) => {
      queryClient.setQueryData(["project", project.id], project);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(`Project "${project.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
}
