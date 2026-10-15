import "server-only";

import { createDeliveryApi } from "@/lib/api/client";
import { getDeliveryApiConfig } from "@/lib/api/config";
import { createHttpTransport } from "@/lib/api/http";
import { createMockTransport } from "@/lib/api/mock";
import { readAccessToken } from "@/lib/api/session-cookie";

export function getDeliveryApi() {
  const config = getDeliveryApiConfig();
  if (config.mode === "mock") return createDeliveryApi(createMockTransport());
  return createDeliveryApi(
    createHttpTransport({
      baseUrl: config.baseUrl,
      timeoutMs: config.timeoutMs,
      getToken: readAccessToken,
    }),
  );
}
