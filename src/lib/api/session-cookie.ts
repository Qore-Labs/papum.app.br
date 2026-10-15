import "server-only";

import { cookies } from "next/headers";

import { apiTokenSchema } from "@/schemas/api/delivery";

function cookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Host-papum_access"
    : "papum_access";
}

export async function readAccessToken(): Promise<string | undefined> {
  const value = (await cookies()).get(cookieName())?.value;
  const parsed = apiTokenSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

// Call writes only from a Server Action/Route Handler, never during RSC rendering.
export async function storeAccessToken(token: string): Promise<void> {
  const value = apiTokenSchema.parse(token);
  (await cookies()).set(cookieName(), value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export async function clearAccessToken(): Promise<void> {
  (await cookies()).delete(cookieName());
}
