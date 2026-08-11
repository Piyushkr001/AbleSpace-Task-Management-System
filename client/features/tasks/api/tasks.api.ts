import { apiClient } from "@/lib/api-client";
import { Task, TaskStatus, TaskPriority } from "../types/task.types";

export interface TasksResponse {
  data: {
    tasks: Task[];
  };
}

export interface TaskResponse {
  data: {
    task: Task;
  };
}

export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  memberId?: string;
  labelId?: string;
  projectId?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  reporterId?: string;
  parentTaskId?: string;
  startDate?: string;
  dueDate?: string;
  memberIds?: string[];
  labelIds?: string[];
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export const tasksApi = {
  getTasks: (params?: TaskQueryParams, token?: string) => {
    const searchParams = new URLSearchParams();

    if (params?.search?.trim()) {
      searchParams.set("search", params.search.trim());
    }
    if (params?.status && params.status.length > 0) {
      params.status.forEach((s) => searchParams.append("status", s));
    }
    if (params?.priority && params.priority.length > 0) {
      params.priority.forEach((p) => searchParams.append("priority", p));
    }
    if (params?.memberId) {
      searchParams.set("memberId", params.memberId);
    }
    if (params?.labelId) {
      searchParams.set("labelId", params.labelId);
    }
    if (params?.projectId) {
      searchParams.set("projectId", params.projectId);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";

    return apiClient<TasksResponse>(endpoint, {
      method: "GET",
      token,
    });
  },

  getTask: (id: string, token?: string) =>
    apiClient<TaskResponse>(`/tasks/${id}`, {
      method: "GET",
      token,
    }),

  createTask: (payload: CreateTaskPayload, token?: string) =>
    apiClient<TaskResponse>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  updateTask: (id: string, payload: UpdateTaskPayload, token?: string) =>
    apiClient<TaskResponse>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    }),

  deleteTask: (id: string, token?: string) =>
    apiClient<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
      token,
    }),
};
