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

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${env.API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : null) ||
      (data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : null) ||
      `HTTP Error ${response.status}`;

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}
