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
});

export interface ApiClientOptions extends Omit<AxiosRequestConfig, "url"> {
  token?: string;
  body?: unknown;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { token, body, headers, data: directData, ...axiosOptions } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const payload = directData ?? body;

  try {
    const response = await axiosInstance<T>({
      url: path,
      headers: requestHeaders,
      data: payload,
      ...axiosOptions,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ message?: string | string[]; error?: string }>;
      const status = axiosErr.response?.status || 500;
      const respData = axiosErr.response?.data;

      let errorMessage: string | null = null;

      if (respData && typeof respData === "object") {
        if ("message" in respData) {
          if (Array.isArray(respData.message)) {
            errorMessage = respData.message.join(", ");
          } else if (typeof respData.message === "string") {
            errorMessage = respData.message;
          }
        }
        if (!errorMessage && "error" in respData && typeof respData.error === "string") {
          errorMessage = respData.error;
        }
      }

      errorMessage = errorMessage || axiosErr.message || `HTTP Error ${status}`;

      throw new ApiError(errorMessage, status, respData);
    }

    throw new ApiError((error as Error).message || "Network Error", 500);
  }
}
