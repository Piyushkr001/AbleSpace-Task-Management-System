"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { tasksApi, UpdateTaskPayload } from "../api/tasks.api";

export function useUpdateTask() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => {
      let token: string | undefined = undefined;
      if (isLoaded && isSignedIn) {
        token = (await getToken()) || undefined;
      }
      const res = await tasksApi.updateTask(id, payload, token);
      return res.data.task;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(`Task "${task.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
}
