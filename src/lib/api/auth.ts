import "server-only";

import { getDeliveryApi } from "@/lib/api";
import { createDeliveryApi, type DeliveryApi } from "@/lib/api/client";
import { getDeliveryApiConfig } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { createHttpTransport } from "@/lib/api/http";
import {
  clearAccessToken,
  readAccessToken,
  storeAccessToken,
} from "@/lib/api/session-cookie";
import type { ApiUser } from "@/types/api";

function liveConfiguration() {
  const config = getDeliveryApiConfig();
  if (config.mode !== "api")
    throw new ApiError(
      "preview_mode",
      "O login da prévia não cria uma sessão real.",
    );
  return config;
}

export async function signIn(
  input: unknown,
  provider: "password" | "google" = "password",
): Promise<ApiUser> {
  const config = liveConfiguration();
  const api = getDeliveryApi();
  const login =
    provider === "google"
      ? await api.auth.googleLogin(input)
      : await api.auth.login(input);
  const token = login.data.access_token;
  const authenticated = createDeliveryApi(
    createHttpTransport({ ...config, getToken: () => token }),
  );
  // Hydrate/verify the account before storing the opaque Sanctum credential.
  const user = await authenticated.auth.me();
  await storeAccessToken(token);
  return user.data;
}

export async function getSessionUser(): Promise<ApiUser | null> {
  if (getDeliveryApiConfig().mode === "mock" || !(await readAccessToken()))
    return null;
  try {
    return (await getDeliveryApi().auth.me()).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    if (getDeliveryApiConfig().mode === "api" && (await readAccessToken()))
      await getDeliveryApi().auth.logout();
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) throw error;
  } finally {
    await clearAccessToken();
  }
}

// For future state-changing Server Actions: keep Next's origin checks enabled,
// validate arguments in the API method and clear revoked credentials on 401.
export async function withDeliverySession<T>(
  operation: (api: DeliveryApi) => Promise<T>,
): Promise<T> {
  liveConfiguration();
  if (!(await readAccessToken()))
    throw new ApiError(
      "unauthorized",
      "Entre na sua conta para continuar.",
      401,
    );
  try {
    return await operation(getDeliveryApi());
  } catch (error) {
    if (error instanceof ApiError && error.status === 401)
      await clearAccessToken();
    throw error;
  }
}
