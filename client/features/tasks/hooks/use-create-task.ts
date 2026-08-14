"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/hooks/use-api-auth";
import { toast } from "react-hot-toast";
import { tasksApi } from "../api/tasks.api";
import { CreateTaskInput } from "../types/task.types";

export function useCreateTask() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskInput) => {
      const token = await getAuthToken();
      const res = await tasksApi.createTask(payload, token);
      return res.data.task;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success(`Task "${task.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
}
