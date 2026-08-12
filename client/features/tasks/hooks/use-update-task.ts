"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { toast } from "react-hot-toast";
import { tasksApi } from "../api/tasks.api";
import { UpdateTaskInput } from "../types/task.types";

export function useUpdateTask() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTaskInput }) => {
      const token = await getAuthToken();
      const res = await tasksApi.updateTask(id, payload, token);
      return res.data.task;
    },
    onSuccess: (task) => {
      queryClient.setQueryData(["task", task.id], task);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(`Task "${task.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
}
