// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { apiSuccess } from "@/__tests__/fixtures/api";
import { getDeliveryApiConfig, validateApiBaseUrl } from "@/lib/api/config";
import { ApiError, toApiFailure } from "@/lib/api/errors";
import { createHttpTransport } from "@/lib/api/http";
import { apiResponseSchema, apiUserSchema } from "@/schemas/api/delivery";

afterEach(() => {
  vi.unstubAllEnvs();
});
const user = { id: 1, name: "Pessoa Teste", email: "pessoa@example.com" };

function setup(response: Response) {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response);
  const transport = createHttpTransport({
    baseUrl: "https://api.example.test/api",
    getToken: () => "1|test-token",
    fetch: fetcher,
  });
  return { fetcher, transport };
}

describe("Cliente HTTP seguro", () => {
  it("envia Bearer somente ao backend configurado e impede cache/redirect/cookies automáticos", async () => {
    const { transport, fetcher } = setup(
      Response.json(apiSuccess({ ...user, password: "não deve sair" })),
    );
    const result = await transport.request(
      "me",
      apiResponseSchema(apiUserSchema),
    );
    const [url, request] = fetcher.mock.calls[0];
    expect(String(url)).toBe("https://api.example.test/api/me");
    expect(new Headers(request?.headers).get("Authorization")).toBe(
      "Bearer 1|test-token",
    );
    expect(request).toMatchObject({
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
    expect(result.data).not.toHaveProperty("password");
  });
  it("não envia o Bearer nas rotas públicas", async () => {
    const { transport, fetcher } = setup(Response.json(apiSuccess(null)));
    await transport.request("register", apiResponseSchema(z.null()), {
      authenticated: false,
      method: "POST",
      body: { email: "pessoa@example.com" },
    });
    const headers = new Headers(fetcher.mock.calls[0][1]?.headers);
    expect(headers.has("Authorization")).toBe(false);
    expect(headers.get("Content-Type")).toBe("application/json");
  });
  it("bloqueia requisição protegida sem credencial antes do fetch", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const transport = createHttpTransport({
      baseUrl: "https://api.example.test/api",
      fetch: fetcher,
    });
    await expect(
      transport.request("me", apiResponseSchema(apiUserSchema)),
    ).rejects.toMatchObject({ status: 401 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("aceita 204 vazio no registro", async () => {
    const { transport } = setup(new Response(null, { status: 204 }));
    await expect(
      transport.request("register", apiResponseSchema(z.null()), {
        authenticated: false,
      }),
    ).resolves.toEqual(apiSuccess(null));
  });
  it("preserva os campos do 422 sem vazar detalhes do backend", async () => {
    const { transport } = setup(
      Response.json(
        {
          message: "SQL e credenciais privadas",
          errors: { email: ["detalhe privado"], password: ["senha privada"] },
        },
        { status: 422 },
      ),
    );
    const error = await transport
      .request("login", apiResponseSchema(z.null()), { authenticated: false })
      .catch(toApiFailure);
    expect(error).toMatchObject({
      status: 422,
      code: "validation_error",
      fields: { email: [expect.any(String)], password: [expect.any(String)] },
    });
    expect(JSON.stringify(error)).not.toMatch(/privad|SQL/);
  });
  it.each([401, 403, 404, 409, 429, 500])(
    "normaliza erro HTTP %i",
    async (status) => {
      const { transport } = setup(
        Response.json(
          {
            success: false,
            error: {
              code: "backend.error",
              message: "stack e segredos",
              info: { token: "privado" },
            },
          },
          { status, headers: { "Retry-After": "120" } },
        ),
      );
      await expect(
        transport.request("me", apiResponseSchema(apiUserSchema)),
      ).rejects.toMatchObject({ status, retryAfter: 120 });
    },
  );
  it("recusa JSON fora do contrato e HTML de sucesso", async () => {
    let setupResult = setup(Response.json(apiSuccess({ ...user, id: "1" })));
    await expect(
      setupResult.transport.request("me", apiResponseSchema(apiUserSchema)),
    ).rejects.toMatchObject({ code: "invalid_response" });
    setupResult = setup(
      new Response("<html>erro</html>", {
        headers: { "Content-Type": "text/html" },
      }),
    );
    await expect(
      setupResult.transport.request("me", apiResponseSchema(apiUserSchema)),
    ).rejects.toMatchObject({ code: "invalid_response" });
  });
  it("limita o tamanho da resposta", async () => {
    const { transport } = setup(
      new Response("x".repeat(2 * 1024 * 1024 + 1), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    await expect(
      transport.request("me", apiResponseSchema(apiUserSchema)),
    ).rejects.toMatchObject({ code: "invalid_response", status: 502 });
  });
  it("aplica timeout sem repetir a operação", async () => {
    const fetcher = vi.fn<typeof fetch>(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () =>
            reject(new Error("detalhe interno")),
          );
        }),
    );
    const transport = createHttpTransport({
      baseUrl: "https://api.example.test/api",
      timeoutMs: 100,
      fetch: fetcher,
    });
    await expect(
      transport.request("login", apiResponseSchema(z.null()), {
        authenticated: false,
      }),
    ).rejects.toMatchObject({ code: "request_timeout", status: 408 });
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it.each([
    "/login",
    "//evil.test/api",
    "https://evil.test/api",
    "../login",
    "firms/%2e%2e/login",
    "me#fragment",
  ])("recusa endpoint arbitrário %s", async (path) => {
    const { transport, fetcher } = setup(Response.json(apiSuccess(null)));
    await expect(
      transport.request(path, apiResponseSchema(z.null())),
    ).rejects.toBeInstanceOf(ApiError);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    "https://user:password@example.test/api",
    "http://example.test/api",
    "file:///api",
    "https://example.test/api?secret=1",
    "https://example.test/v1",
  ])("recusa URL base insegura %s", (url) => {
    expect(() => validateApiBaseUrl(url)).toThrow(ApiError);
  });
  it("mantém mock como padrão e falha fechado para configuração inválida", () => {
    vi.stubEnv("DELIVERY_DATA_SOURCE", undefined);
    vi.stubEnv("DELIVERY_API_BASE_URL", undefined);
    expect(getDeliveryApiConfig().mode).toBe("mock");
    vi.stubEnv("DELIVERY_DATA_SOURCE", "api");
    expect(() => getDeliveryApiConfig()).toThrow(ApiError);
    vi.stubEnv("DELIVERY_DATA_SOURCE", "typo");
    expect(() => getDeliveryApiConfig()).toThrow(ApiError);
  });
  it("permite HTTP loopback só fora de produção", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(validateApiBaseUrl("http://127.0.0.1:8000/api/")).toBe(
      "http://127.0.0.1:8000/api",
    );
    vi.stubEnv("NODE_ENV", "production");
    expect(() => validateApiBaseUrl("http://127.0.0.1:8000/api")).toThrow(
      ApiError,
    );
  });
});
