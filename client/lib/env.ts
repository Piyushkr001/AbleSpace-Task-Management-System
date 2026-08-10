const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured in environment variables");
}

export const env = {
  API_URL: apiUrl,
};
