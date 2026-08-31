export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[@freight/database] Missing required environment variable "${name}". ` +
        "Set it in your .env file (see .env.example at the repo root) — " +
        "both DATABASE_URL and DATABASE_URL_UNPOOLED come from the Neon " +
        "integration in Vercel.",
    );
  }
  return value;
}

export const DATABASE_URL = requireEnv("DATABASE_URL");
