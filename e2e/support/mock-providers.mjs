// Loaded only by Playwright's local server, never imported by the application.
if (
  process.env.PAPUM_E2E !== "1" ||
  process.env.RESEND_API_KEY !== "e2e-resend-api-key" ||
  process.env.TURNSTILE_SECRET_KEY !== "e2e-turnstile-secret"
) {
  throw new Error("E2E providers require isolated test credentials.");
}

const originalFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  const url = new URL(request.url);

  if (
    url.href === "https://challenges.cloudflare.com/turnstile/v0/siteverify"
  ) {
    const body = await request.json();
    const success =
      body.secret === "e2e-turnstile-secret" &&
      body.response === "e2e-valid-token";
    return Response.json({
      success,
      hostname: "127.0.0.1",
      action: "launch_waitlist",
    });
  }

  if (url.href === "https://api.resend.com/emails/batch") {
    if (request.headers.get("authorization") !== "Bearer e2e-resend-api-key") {
      throw new Error("Unexpected provider credentials.");
    }
    const emails = await request.json();
    if (!Array.isArray(emails) || emails.length !== 2) {
      return Response.json({ error: "invalid batch" }, { status: 400 });
    }
    const rejected = emails.some((email) =>
      [email.to].flat().includes("qa-provider-error@example.com"),
    );
    return rejected
      ? Response.json({ error: "simulated rejection" }, { status: 503 })
      : Response.json({
          data: [{ id: "e2e-notification" }, { id: "e2e-confirmation" }],
        });
  }

  if (url.origin === "http://127.0.0.1:3100") return originalFetch(input, init);
  throw new Error("External requests are disabled in E2E tests.");
};
