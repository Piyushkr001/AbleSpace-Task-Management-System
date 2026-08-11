"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { tasksApi, CreateTaskPayload } from "../api/tasks.api";

export function useCreateTask() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      let token: string | undefined = undefined;
      if (isLoaded && isSignedIn) {
        token = (await getToken()) || undefined;
      }
      const res = await tasksApi.createTask(payload, token);
      return res.data.task;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(`Task "${task.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
}
