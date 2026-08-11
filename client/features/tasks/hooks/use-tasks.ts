"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { tasksApi, TaskQueryParams } from "../api/tasks.api";

export function useTasks(params?: TaskQueryParams) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  return useQuery({
    queryKey: ["tasks", params],
    queryFn: async () => {
      let token: string | undefined = undefined;
      if (isLoaded && isSignedIn) {
        token = (await getToken()) || undefined;
      }
      const res = await tasksApi.getTasks(params, token);
      return res.data.tasks;
    },
    enabled: isLoaded,
  });
}
