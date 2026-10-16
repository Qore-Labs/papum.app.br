import { describe, expect, it } from "vitest";

import { getTurnstileFailure } from "@/lib/turnstile";

describe("Erros da verificação de segurança", () => {
  it.each(["110100", "110110", "400020", "400021", "400070"])(
    "classifica erro de configuração %s",
    (code) => {
      expect(getTurnstileFailure(code)).toMatchObject({
        code,
        retryable: false,
        message: expect.stringContaining("configuração"),
      });
    },
  );
  it("distingue domínio não autorizado de falha de rede", () => {
    expect(getTurnstileFailure("110200")).toMatchObject({
      retryable: false,
      message: expect.stringContaining("endereço"),
    });
    expect(getTurnstileFailure("200500")).toMatchObject({
      retryable: true,
      message: expect.stringContaining("conectar"),
    });
  });
  it.each(["110600", "110620"])(
    "permite reiniciar desafio expirado %s",
    (code) => {
      expect(getTurnstileFailure(code)).toMatchObject({
        retryable: true,
        message: expect.stringContaining("expirou"),
      });
    },
  );
  it("orienta conferir relógio em erro de horário ou cache", () => {
    expect(getTurnstileFailure("200100").message).toContain("data e a hora");
  });
  it.each([
    undefined,
    "<script>alert(1)</script>",
    "private-token",
    { token: "secret" },
  ])("não inclui dados inesperados na mensagem pública: %j", (value) => {
    expect(getTurnstileFailure(value)).toMatchObject({
      code: null,
      retryable: true,
    });
    expect(JSON.stringify(getTurnstileFailure(value))).not.toMatch(
      /script>|secret|private-token/,
    );
  });
});
