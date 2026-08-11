"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { tasksApi } from "../api/tasks.api";

export function useDeleteTask() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      let token: string | undefined = undefined;
      if (isLoaded && isSignedIn) {
        token = (await getToken()) || undefined;
      }
      return tasksApi.deleteTask(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
}
