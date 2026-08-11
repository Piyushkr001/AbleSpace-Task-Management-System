import { apiClient } from "@/lib/api-client";
import { Label } from "@/features/tasks/types/task.types";

export interface LabelsResponse {
  data: {
    labels: Label[];
  };
}

export interface LabelResponse {
  data: {
    label: Label;
  };
}

export interface CreateLabelPayload {
  name: string;
  color?: string;
}

export const labelsApi = {
  getLabels: (token?: string) =>
    apiClient<LabelsResponse>("/labels", {
      method: "GET",
      token,
    }),

  createLabel: (payload: CreateLabelPayload, token?: string) =>
    apiClient<LabelResponse>("/labels", {
      method: "POST",
      data: payload,
      token,
    }),
};
