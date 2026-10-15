import "server-only";

import { createHmac } from "node:crypto";
import { z } from "zod";

import { buildLaunchEmails } from "@/lib/email/launch-templates";
import { launchInterestRequestSchema } from "@/schemas/waitlist-form";
import type { WaitlistSubmissionResult } from "@/types/waitlist";

const unavailable: WaitlistSubmissionResult = {
  status: "error",
  message:
    "Não foi possível concluir o cadastro agora. Tente novamente em breve.",
};
const verificationError: WaitlistSubmissionResult = {
  status: "error",
  message: "Conclua a verificação de segurança e tente novamente.",
};
const configurationSchema = z.object({
  apiKey: z
    .string()
    .trim()
    .min(10)
    .max(512)
    .regex(/^[\x21-\x7e]+$/),
  sender: z.string().email().default("contato@binaryinc.com.br"),
  notificationEmail: z.string().email().default("contato@binaryinc.com.br"),
  turnstileSecret: z.string().trim().min(10).max(512),
  hostnames: z
    .string()
    .default("papum.app.br,www.papum.app.br")
    .transform((value) =>
      value.split(",").map((host) => host.trim().toLowerCase()),
    )
    .pipe(z.array(z.string().regex(/^[a-z0-9.-]+$/)).min(1)),
});
const verificationSchema = z.object({
  success: z.literal(true),
  hostname: z.string(),
  action: z.literal("launch_waitlist"),
});
const sentSchema = z.object({
  data: z.array(z.object({ id: z.string().min(1).max(128) })).length(2),
});

export async function submitLaunchInterest(
  input: unknown,
): Promise<WaitlistSubmissionResult> {
  const request = launchInterestRequestSchema.safeParse(input);
  if (!request.success)
    return {
      status: "error",
      message: "Confira seu e-mail e tente novamente.",
    };
  if (request.data.website) return unavailable;

  const config = configurationSchema.safeParse({
    apiKey: process.env.RESEND_API_KEY,
    sender: process.env.RESEND_FROM_EMAIL,
    notificationEmail: process.env.RESEND_NOTIFICATION_EMAIL,
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
    hostnames: process.env.WAITLIST_ALLOWED_HOSTNAMES,
  });
  if (!config.success) return unavailable;
  if (!request.data.verificationToken) return verificationError;

  try {
    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          secret: config.data.turnstileSecret,
          response: request.data.verificationToken,
        }),
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!verificationResponse.ok) return verificationError;
    const verification = verificationSchema.safeParse(
      await verificationResponse.json(),
    );
    if (
      !verification.success ||
      !config.data.hostnames.includes(verification.data.hostname.toLowerCase())
    )
      return verificationError;

    const emails = buildLaunchEmails({
      email: request.data.email,
      sender: config.data.sender,
      notificationEmail: config.data.notificationEmail,
    });
    const body = JSON.stringify(emails);
    // Stable payload + HMAC key: retries within Resend's 24h window do not resend the pair.
    const key = createHmac("sha256", config.data.apiKey)
      .update(body)
      .digest("hex");
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.data.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Idempotency-Key": `papum-launch-v1/${key}`,
      },
      body,
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return response.status === 429
        ? {
            status: "error",
            message:
              "Estamos recebendo muitos contatos. Aguarde um pouco e tente novamente.",
          }
        : unavailable;
    }
    if (!sentSchema.safeParse(await response.json()).success)
      return unavailable;
    return {
      status: "success",
      message:
        "Recebemos seu contato! Obrigado pelo interesse. Vamos avisar você sobre as novidades do Pápum Delivery.",
    };
  } catch {
    // Never return provider errors, addresses, credentials or verification tokens to the browser.
    return unavailable;
  }
}
