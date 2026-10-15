// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildLaunchEmails } from "@/lib/email/launch-templates";
import { subscribeToLaunch } from "@/lib/actions/subscribe-to-launch";

const input = {
  email: "Cliente@Exemplo.COM",
  verificationToken: "one-use-challenge",
  website: "",
};
const verified = {
  success: true,
  hostname: "papum.app.br",
  action: "launch_waitlist",
};
const accepted = {
  data: [{ id: "notification-id" }, { id: "confirmation-id" }],
};

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_secret_test_only");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile_secret_test_only");
  vi.stubEnv("RESEND_FROM_EMAIL", undefined);
  vi.stubEnv("RESEND_NOTIFICATION_EMAIL", undefined);
  vi.stubEnv("WAITLIST_ALLOWED_HOSTNAMES", undefined);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Cadastro de interesse no lançamento", () => {
  it("valida o desafio antes de enviar os dois e-mails e só então confirma o contato", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(verified))
      .mockResolvedValueOnce(Response.json(accepted));
    vi.stubGlobal("fetch", fetcher);
    await expect(subscribeToLaunch(input)).resolves.toMatchObject({
      status: "success",
    });
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(fetcher.mock.calls[1][0]).toBe(
      "https://api.resend.com/emails/batch",
    );
    const body = JSON.parse(String(fetcher.mock.calls[1][1]?.body));
    expect(body).toHaveLength(2);
    expect(body[0]).toMatchObject({
      from: "Pápum Delivery <contato@binaryinc.com.br>",
      to: ["contato@binaryinc.com.br"],
      reply_to: "cliente@exemplo.com",
      subject: "Cliente interessado nos serviços PAPUM Delivery",
    });
    expect(body[1]).toMatchObject({
      to: ["cliente@exemplo.com"],
      reply_to: "contato@binaryinc.com.br",
    });
    expect(body[1].html).toContain("Recebemos seu contato");
    expect(body[1].html + body[1].text + body[1].subject).not.toMatch(
      /binary/i,
    );
    expect(JSON.stringify(body)).not.toContain(input.verificationToken);
    expect(fetcher.mock.calls[1][1]).toMatchObject({
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
    });
  });
  it("não envia nada com configuração ausente, e-mail inválido ou honeypot preenchido", async () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetcher);
    vi.stubEnv("RESEND_API_KEY", undefined);
    await expect(subscribeToLaunch(input)).resolves.toMatchObject({
      status: "error",
    });
    await expect(
      subscribeToLaunch({ ...input, email: "inválido" }),
    ).resolves.toMatchObject({ status: "error" });
    await expect(
      subscribeToLaunch({ ...input, website: "bot.example" }),
    ).resolves.toMatchObject({ status: "error" });
    await expect(
      subscribeToLaunch({ ...input, to: "outro@example.com" }),
    ).resolves.toMatchObject({ status: "error" });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { ...verified, hostname: "evil.example" },
    { ...verified, action: "another_form" },
  ])(
    "bloqueia token inválido, repetido ou de outro contexto: %j",
    async (verification) => {
      const fetcher = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json(verification));
      vi.stubGlobal("fetch", fetcher);
      await expect(subscribeToLaunch(input)).resolves.toMatchObject({
        status: "error",
        message: expect.stringContaining("verificação"),
      });
      expect(fetcher).toHaveBeenCalledOnce();
    },
  );
  it("exige token mesmo quando o remetente já está configurado", async () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetcher);
    await expect(
      subscribeToLaunch({ ...input, verificationToken: "" }),
    ).resolves.toMatchObject({ status: "error" });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([429, 403, 500])(
    "não confirma o contato nem expõe o erro interno quando Resend retorna %i",
    async (status) => {
      const fetcher = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(Response.json(verified))
        .mockResolvedValueOnce(
          Response.json(
            { message: "segredo re_private", name: "provider_debug" },
            { status },
          ),
        );
      vi.stubGlobal("fetch", fetcher);
      const result = await subscribeToLaunch(input);
      expect(result.status).toBe("error");
      expect(JSON.stringify(result)).not.toMatch(/re_private|provider_debug/);
    },
  );
  it("não confirma se apenas um dos e-mails foi aceito", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(Response.json(verified))
        .mockResolvedValueOnce(Response.json({ data: [{ id: "only-one" }] })),
    );
    await expect(subscribeToLaunch(input)).resolves.toMatchObject({
      status: "error",
    });
  });
  it("usa chave idempotente estável sem e-mail ou token para tentativas equivalentes", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async (url) =>
        Response.json(String(url).includes("siteverify") ? verified : accepted),
      );
    vi.stubGlobal("fetch", fetcher);
    await subscribeToLaunch(input);
    await subscribeToLaunch({
      ...input,
      verificationToken: "new-one-use-token",
    });
    const first = new Headers(fetcher.mock.calls[1][1]?.headers).get(
      "Idempotency-Key",
    );
    expect(first).toBe(
      new Headers(fetcher.mock.calls[3][1]?.headers).get("Idempotency-Key"),
    );
    expect(first).toMatch(/^papum-launch-v1\/[a-f0-9]{64}$/);
    expect(first).not.toContain("cliente");
    expect(fetcher.mock.calls[1][1]?.body).toEqual(
      fetcher.mock.calls[3][1]?.body,
    );
  });
  it("trata indisponibilidade de rede sem repetir envios automaticamente", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("re_private"));
    vi.stubGlobal("fetch", fetcher);
    await expect(subscribeToLaunch(input)).resolves.toMatchObject({
      status: "error",
    });
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it("escapa conteúdo no HTML da notificação interna", () => {
    const emails = buildLaunchEmails({
      email: '<script>alert("x")</script>',
      sender: "contato@binaryinc.com.br",
      notificationEmail: "contato@binaryinc.com.br",
    });
    expect(emails[0].html).not.toContain("<script>");
    expect(emails[0].html).toContain("&lt;script&gt;");
  });
});
