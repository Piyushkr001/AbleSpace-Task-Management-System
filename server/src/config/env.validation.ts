export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  COOKIE_NAME: string;
  CLERK_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const requiredKeys = [
    "DATABASE_URL",
    "CLIENT_URL",
    "JWT_SECRET",
    "COOKIE_NAME",
    "CLERK_SECRET_KEY",
  ];

  const missingKeys: string[] = [];

  for (const key of requiredKeys) {
    const value = config[key];
    if (!value || typeof value !== "string" || value.trim() === "") {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `[Config Error] Missing or empty required environment variable(s): ${missingKeys.join(
        ", "
      )}.`
    );
  }

  return {
    PORT: Number(config.PORT) || 5001,
    NODE_ENV: (config.NODE_ENV as string) || "development",
    DATABASE_URL: config.DATABASE_URL as string,
    CLIENT_URL: (config.CLIENT_URL as string).replace(/\/$/, ""),
    JWT_SECRET: config.JWT_SECRET as string,
    COOKIE_NAME: config.COOKIE_NAME as string,
    CLERK_SECRET_KEY: config.CLERK_SECRET_KEY as string,
    JWT_EXPIRES_IN: (config.JWT_EXPIRES_IN as string) || "7d",
  };
}
