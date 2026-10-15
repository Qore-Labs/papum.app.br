import "server-only";

import { z } from "zod";

import { validateApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { apiTokenSchema } from "@/schemas/api/delivery";
import type { ApiTransport } from "@/types/api";

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const errorEnvelope = z.object({
  success: z.literal(false),
  error: z.object({
    code: z
      .string()
      .max(128)
      .regex(/^[a-zA-Z0-9_.-]+$/),
  }),
});
const validationEnvelope = z.object({ errors: z.record(z.array(z.string())) });

export interface HttpTransportOptions {
  baseUrl: string;
  timeoutMs?: number;
  getToken?: () => string | undefined | Promise<string | undefined>;
  fetch?: typeof globalThis.fetch;
}

async function readJson(response: Response): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader)
    throw new ApiError(
      "invalid_response",
      "A API retornou uma resposta inválida.",
      502,
    );
  let bytes = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new ApiError(
          "invalid_response",
          "A resposta da API excedeu o limite permitido.",
          502,
        );
      }
      text += decoder.decode(part.value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "invalid_response",
      "A API retornou uma resposta inválida.",
      502,
    );
  } finally {
    reader.releaseLock();
  }
}

function httpError(response: Response, payload: unknown): ApiError {
  const parsed = errorEnvelope.safeParse(payload);
  const code = parsed.success ? parsed.data.error.code : "request_failed";
  const retry = response.headers.get("Retry-After");
  const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : null;
  const retryAfter =
    seconds !== null && Number.isSafeInteger(seconds)
      ? Math.min(seconds, 86400)
      : null;
  if (response.status === 422) {
    const validation = validationEnvelope.safeParse(payload);
    const fields: Record<string, string[]> = {};
    if (validation.success) {
      for (const key of Object.keys(validation.data.errors).slice(0, 100)) {
        if (
          /^[a-zA-Z0-9_.]{1,100}$/.test(key) &&
          !key
            .split(".")
            .some((segment) =>
              ["__proto__", "constructor", "prototype"].includes(segment),
            )
        ) {
          fields[key] = ["Confira o valor informado neste campo."];
        }
      }
    }
    return new ApiError(
      "validation_error",
      "Confira os campos destacados.",
      422,
      fields,
    );
  }
  const messages: Record<number, string> = {
    400: "Confira os dados enviados.",
    401: "Sua sessão expirou ou as credenciais são inválidas.",
    403: "Esta operação não está disponível para sua conta.",
    404: "O recurso não foi encontrado ou não está disponível para sua conta.",
    409: "A operação conflita com o estado atual dos dados.",
    413: "O arquivo excede o tamanho permitido.",
    429: "Muitas tentativas. Aguarde antes de tentar novamente.",
  };
  const specific: Record<string, string> = {
    "invalid.credentials": "E-mail ou senha incorretos.",
    "error.user.email_not_verified": "Confirme seu e-mail antes de entrar.",
    "your.email.address.is.not.verified.":
      "Confirme seu e-mail antes de continuar.",
    "error.category.has_products":
      "Mova ou exclua os produtos antes de remover a categoria.",
    "you.have.reached.the.maximum.number.of.images":
      "O estabelecimento atingiu o limite de 30 imagens.",
    "error.password.forgot":
      "Se houver uma conta com esse e-mail, enviaremos as instruções.",
    "error.password.reset": "O link de redefinição é inválido ou expirou.",
  };
  // Never forward backend debug messages, traces or info (including on 500).
  return new ApiError(
    response.status >= 500 ? "server_error" : code,
    specific[code] ??
      messages[response.status] ??
      "O serviço está indisponível. Tente novamente mais tarde.",
    response.status,
    {},
    retryAfter,
  );
}

export function createHttpTransport(
  options: HttpTransportOptions,
): ApiTransport {
  const baseUrl = validateApiBaseUrl(options.baseUrl);
  const fetcher = options.fetch ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 10000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) {
    throw new ApiError(
      "invalid_configuration",
      "O timeout da API deve estar entre 100 e 60000 ms.",
    );
  }
  return {
    async request(path, schema, request = {}) {
      if (
        !path ||
        path.startsWith("/") ||
        /^[a-z][a-z0-9+.-]*:/i.test(path) ||
        /[\\#\x00-\x20]|\.\.|%2e/i.test(path)
      ) {
        throw new ApiError("invalid_path", "O endpoint da API é inválido.");
      }
      const url = new URL(`${baseUrl}/${path}`);
      if (
        url.origin !== new URL(baseUrl).origin ||
        !url.pathname.startsWith(new URL(baseUrl).pathname + "/")
      ) {
        throw new ApiError("invalid_path", "O endpoint da API é inválido.");
      }
      const headers = new Headers({ Accept: "application/json" });
      if (request.authenticated !== false) {
        const token = apiTokenSchema.safeParse(await options.getToken?.());
        if (!token.success)
          throw new ApiError(
            "unauthorized",
            "Entre na sua conta para continuar.",
            401,
          );
        headers.set("Authorization", `Bearer ${token.data}`);
      }
      const multipart = request.body instanceof FormData;
      if (request.body !== undefined && !multipart)
        headers.set("Content-Type", "application/json");
      const signal = AbortSignal.timeout(timeoutMs);
      try {
        const response = await fetcher(url, {
          method: request.method ?? "GET",
          headers,
          body:
            request.body === undefined
              ? undefined
              : multipart
                ? (request.body as FormData)
                : JSON.stringify(request.body),
          cache: "no-store",
          credentials: "omit",
          redirect: "error",
          referrerPolicy: "no-referrer",
          signal,
        });
        let payload: unknown;
        if (response.status === 204) {
          payload = { success: true, message: null, data: null };
        } else if (
          /^application\/(?:[a-z0-9.+-]+\+)?json(?:;|$)/i.test(
            response.headers.get("Content-Type") ?? "",
          )
        ) {
          try {
            payload = await readJson(response);
          } catch (error) {
            if (response.ok) throw error;
          }
        } else {
          await response.body?.cancel();
        }
        if (!response.ok) throw httpError(response, payload);
        const result = schema.safeParse(payload);
        if (!result.success)
          throw new ApiError(
            "invalid_response",
            "A resposta da API não corresponde ao contrato esperado.",
            502,
          );
        return result.data;
      } catch (error) {
        if (signal.aborted)
          throw new ApiError(
            "request_timeout",
            "O serviço demorou a responder. Tente novamente.",
            408,
          );
        if (error instanceof ApiError) throw error;
        throw new ApiError(
          "network_error",
          "Não foi possível conectar ao serviço. Tente novamente.",
        );
      }
    },
  };
}
