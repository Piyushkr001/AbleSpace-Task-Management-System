"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { tasksApi } from "../api/tasks.api";

export function useTask(taskId: string) {
  const { isLoaded, getAuthToken } = useApiAuth();

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const token = await getAuthToken();
      const res = await tasksApi.getTask(taskId, token);
      return res.data.task;
    },
    enabled: isLoaded && Boolean(taskId),
  });
}
