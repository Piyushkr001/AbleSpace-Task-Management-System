import { apiClient } from "@/lib/api-client";
import {
  CreateProjectInput,
  ProjectResponse,
  ProjectsResponse,
  UpdateProjectInput,
} from "../types/project.types";

export const projectsApi = {
  getProjects: (token?: string) =>
    apiClient<ProjectsResponse>("/projects", {
      method: "GET",
      token,
    }),

  getProject: (id: string, token?: string) =>
    apiClient<ProjectResponse>(`/projects/${id}`, {
      method: "GET",
      token,
    }),

  createProject: (payload: CreateProjectInput, token?: string) =>
    apiClient<ProjectResponse>("/projects", {
      method: "POST",
      data: payload,
      token,
    }),

  updateProject: (id: string, payload: UpdateProjectInput, token?: string) =>
    apiClient<ProjectResponse>(`/projects/${id}`, {
      method: "PATCH",
      data: payload,
      token,
    }),

  deleteProject: (id: string, token?: string) =>
    apiClient<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
      token,
    }),
};
