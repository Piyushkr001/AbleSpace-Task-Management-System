"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useApiAuth } from "@/hooks/use-api-auth";
import { labelsApi, CreateLabelPayload } from "../api/labels.api";

export function useLabels() {
  const { isLoaded, getAuthToken } = useApiAuth();

  return useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const token = await getAuthToken();
      const res = await labelsApi.getLabels(token);
      return res.data.labels;
    },
    enabled: isLoaded,
  });
}

export function useCreateLabel() {
  const { getAuthToken } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLabelPayload) => {
      const token = await getAuthToken();
      const res = await labelsApi.createLabel(payload, token);
      return res.data.label;
    },
    onSuccess: (label) => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      toast.success(`Label "${label.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create label");
    },
  });
}
