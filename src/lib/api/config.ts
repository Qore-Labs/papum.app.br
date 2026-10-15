import "server-only";

import { z } from "zod";

import { ApiError } from "@/lib/api/errors";

const environmentSchema = z.object({
  mode: z.enum(["mock", "api"]).default("mock"),
  baseUrl: z.string().optional(),
  timeoutMs: z.coerce.number().int().min(100).max(60000).default(10000),
});

export function getDeliveryApiConfig() {
  const result = environmentSchema.safeParse({
    mode: process.env.DELIVERY_DATA_SOURCE,
    baseUrl: process.env.DELIVERY_API_BASE_URL,
    timeoutMs: process.env.DELIVERY_API_TIMEOUT_MS,
  });
  if (!result.success)
    throw new ApiError(
      "invalid_configuration",
      "Confira a configuração da integração.",
    );
  const config = result.data;
  if (config.mode === "mock")
    return { mode: "mock" as const, timeoutMs: config.timeoutMs };
  return {
    mode: "api" as const,
    timeoutMs: config.timeoutMs,
    baseUrl: validateApiBaseUrl(config.baseUrl),
  };
}

export function validateApiBaseUrl(value: string | undefined): string {
  try {
    const url = new URL(value ?? "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.protocol !== "https:" &&
        !(
          url.protocol === "http:" &&
          local &&
          process.env.NODE_ENV !== "production"
        )) ||
      !url.pathname.replace(/\/$/, "").endsWith("/api")
    )
      throw new Error();
    return url.href.replace(/\/$/, "");
  } catch {
    throw new ApiError(
      "invalid_configuration",
      "Configure uma URL HTTPS terminada em /api. HTTP local é permitido no desenvolvimento.",
    );
  }
}
