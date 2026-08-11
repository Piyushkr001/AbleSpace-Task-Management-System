import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { env } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiClientOptions extends Omit<AxiosRequestConfig, "url"> {
  token?: string;
  body?: unknown;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { token, body, headers, ...axiosOptions } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Support legacy `body` stringified parameter or direct data payload
  let data = options.data ?? body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // Keep as string if not JSON
    }
  }

  try {
    const response = await axiosInstance<T>({
      url: path,
      headers: requestHeaders,
      data,
      ...axiosOptions,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
      const status = axiosErr.response?.status || 500;
      const respData = axiosErr.response?.data;

      const errorMessage =
        (respData && typeof respData === "object" && "message" in respData && typeof respData.message === "string"
          ? respData.message
          : null) ||
        (respData && typeof respData === "object" && "error" in respData && typeof respData.error === "string"
          ? respData.error
          : null) ||
        axiosErr.message ||
        `HTTP Error ${status}`;

      throw new ApiError(errorMessage, status, respData);
    }

    throw new ApiError((error as Error).message || "Network Error", 500);
  }
}
