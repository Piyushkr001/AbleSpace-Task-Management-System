"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { toast } from "react-hot-toast";
import { tasksApi } from "../api/tasks.api";

export function useDeleteTask() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
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
