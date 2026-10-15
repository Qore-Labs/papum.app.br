// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiSuccess } from "@/__tests__/fixtures/api";
import {
  getSessionUser,
  signIn,
  signOut,
  withDeliverySession,
} from "@/lib/api/auth";
import { readAccessToken } from "@/lib/api/session-cookie";

const cookieStore = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
const user = { id: 1, name: "Pessoa Teste", email: "pessoa@example.com" };
const credentials = { email: user.email, password: "senha-teste" };

beforeEach(() => {
  vi.stubEnv("DELIVERY_DATA_SOURCE", "api");
  vi.stubEnv("DELIVERY_API_BASE_URL", "https://backend.example.test/api");
  vi.stubEnv("DELIVERY_API_TIMEOUT_MS", "1000");
  vi.stubEnv("NODE_ENV", "production");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe("Preparação de autenticação no servidor", () => {
  it("valida /me antes de gravar cookie HttpOnly e retorna apenas o usuário", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json(apiSuccess({ access_token: "1|secret-test" })),
      )
      .mockResolvedValueOnce(Response.json(apiSuccess(user)));
    vi.stubGlobal("fetch", fetcher);
    const result = await signIn(credentials);
    expect(result).toEqual(user);
    expect(result).not.toHaveProperty("access_token");
    expect(
      new Headers(fetcher.mock.calls[0][1]?.headers).has("Authorization"),
    ).toBe(false);
    expect(
      new Headers(fetcher.mock.calls[1][1]?.headers).get("Authorization"),
    ).toBe("Bearer 1|secret-test");
    expect(cookieStore.set).toHaveBeenCalledWith(
      "__Host-papum_access",
      "1|secret-test",
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 28800,
      },
    );
  });
  it("não grava credenciais quando a verificação da conta falha", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json(apiSuccess({ access_token: "1|secret-test" })),
      )
      .mockResolvedValueOnce(
        Response.json(
          {
            success: false,
            error: { code: "your.email.address.is.not.verified." },
          },
          { status: 403 },
        ),
      );
    vi.stubGlobal("fetch", fetcher);
    await expect(signIn(credentials)).rejects.toMatchObject({ status: 403 });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });
  it("prepara a troca do token Google sem repassá-lo à API /me", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json(apiSuccess({ access_token: "1|sanctum" })),
      )
      .mockResolvedValueOnce(Response.json(apiSuccess(user)));
    vi.stubGlobal("fetch", fetcher);
    await signIn({ token: "google-id-token" }, "google");
    expect(String(fetcher.mock.calls[0][0])).toMatch(/\/google\/login$/);
    expect(fetcher.mock.calls[0][1]?.body).toBe('{"token":"google-id-token"}');
    expect(
      new Headers(fetcher.mock.calls[1][1]?.headers).get("Authorization"),
    ).toBe("Bearer 1|sanctum");
  });
  it("mantém prévia sem requisições ou sessão real", async () => {
    vi.stubEnv("DELIVERY_DATA_SOURCE", "mock");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(getSessionUser()).resolves.toBeNull();
    await expect(signIn(credentials)).rejects.toMatchObject({
      code: "preview_mode",
    });
    expect(fetcher).not.toHaveBeenCalled();
    expect(cookieStore.get).not.toHaveBeenCalled();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });
  it("trata sessão revogada como usuário ausente sem escrever durante renderização", async () => {
    cookieStore.get.mockReturnValue({ value: "1|revoked" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({}, { status: 401 })),
    );
    await expect(getSessionUser()).resolves.toBeNull();
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });
  it("remove cookie revogado nas operações que podem escrever cookies", async () => {
    cookieStore.get.mockReturnValue({ value: "1|revoked" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({}, { status: 401 })),
    );
    await expect(
      withDeliverySession((api) => api.firms.list()),
    ).rejects.toMatchObject({ status: 401 });
    expect(cookieStore.delete).toHaveBeenCalledWith("__Host-papum_access");
  });
  it.each([401, 500])(
    "limpa a credencial local no logout mesmo quando a API retorna %i",
    async (status) => {
      cookieStore.get.mockReturnValue({ value: "1|old-session" });
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(Response.json({}, { status })),
      );
      const result = signOut();
      if (status === 401) await expect(result).resolves.toBeUndefined();
      else await expect(result).rejects.toMatchObject({ status });
      expect(cookieStore.delete).toHaveBeenCalledWith("__Host-papum_access");
    },
  );
  it("recusa cookies inválidos e bloqueia operação protegida sem sessão", async () => {
    cookieStore.get.mockReturnValue({ value: "token\r\nmalicioso" });
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(readAccessToken()).resolves.toBeUndefined();
    await expect(
      withDeliverySession((api) => api.firms.list()),
    ).rejects.toMatchObject({ status: 401 });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
