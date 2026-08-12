import { apiClient } from "@/lib/api-client";
import { Task, TaskStatus, TaskPriority, CreateTaskInput, UpdateTaskInput } from "../types/task.types";

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
  memberId?: string[];
  labelId?: string[];
  projectId?: string;
  parentTaskId?: string;
}

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
    if (params?.memberId && params.memberId.length > 0) {
      params.memberId.forEach((mId) => searchParams.append("memberId", mId));
    }
    if (params?.labelId && params.labelId.length > 0) {
      params.labelId.forEach((lId) => searchParams.append("labelId", lId));
    }
    if (params?.projectId) {
      searchParams.set("projectId", params.projectId);
    }
    if (params?.parentTaskId) {
      searchParams.set("parentTaskId", params.parentTaskId);
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

  createTask: (payload: CreateTaskInput, token?: string) =>
    apiClient<TaskResponse>("/tasks", {
      method: "POST",
      data: payload,
      token,
    }),

  updateTask: (id: string, payload: UpdateTaskInput, token?: string) =>
    apiClient<TaskResponse>(`/tasks/${id}`, {
      method: "PATCH",
      data: payload,
      token,
    }),

  deleteTask: (id: string, token?: string) =>
    apiClient<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
      token,
    }),
};
