import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import { LogoColored } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";
import { SOCIAL_LOGIN_PROVIDERS } from "@/utils/contents/auth";

export const metadata: Metadata = {
  title: `Entrar | ${siteConfig.name}`,
  description:
    "Acesse sua conta no Pápum! Delivery para pedir seus pratos favoritos.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-svh flex-1 bg-white lg:grid-cols-[7fr_5fr]">
      <div
        aria-hidden="true"
        className="relative hidden overflow-hidden lg:block"
      >
        <Image
          src="/login/branding-food.png"
          alt=""
          width={1216}
          height={880}
          fetchPriority="high"
          sizes="(min-width: 1024px) 120vw, 0px"
          className="absolute -top-[4.23%] -left-[75.03%] h-[108.36%] w-[205.35%] max-w-none object-cover"
        />
      </div>

      <div className="flex min-w-0 items-center justify-center px-6 py-8 sm:p-12 lg:px-10 xl:px-12">
        <div className="flex w-full max-w-112 flex-col gap-8">
          <div className="flex h-26 shrink-0 justify-center sm:h-32.25">
            <LogoColored
              role="img"
              aria-label={siteConfig.name}
              viewBox="-246 -60 1636 464"
              width={304.34}
              height={86.357}
              className="h-auto max-h-[86.357px] w-[304.34px] max-w-full self-start"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-jakarta text-brand-ink text-[28px] leading-9 font-extrabold tracking-[-0.9px] sm:text-[32px] sm:leading-10">
              Bem-vindo de volta!
            </h1>
            <p className="font-vietnam text-brand-muted/80 text-base leading-6.5">
              Entre para pedir seus pratos favoritos.
            </p>
          </div>

          <LoginForm />

          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="border-auth-border/30 absolute inset-x-0 top-1/2 border-t"
            />
            <span className="font-jakarta text-brand-muted/80 relative bg-white px-4 text-sm leading-5">
              Ou continue com
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <p id="social-login-unavailable" className="sr-only">
              O login com redes sociais estará disponível em breve.
            </p>
            {SOCIAL_LOGIN_PROVIDERS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant="accent"
                size="lg"
                disabled
                aria-describedby="social-login-unavailable"
                className="border-auth-border/20 bg-auth-social font-jakarta text-brand-ink focus-visible:outline-auth-link h-12 w-full gap-3 rounded-xl border px-4 py-3.5 text-sm leading-5 font-semibold shadow-xs disabled:opacity-100"
              >
                <Icon aria-hidden="true" />
                {label}
              </Button>
            ))}
          </div>

          <p className="font-vietnam text-brand-muted flex min-h-11 flex-wrap items-center justify-center gap-x-0.75 text-center text-sm leading-5 sm:min-h-5.25">
            Ainda não tem conta?{" "}
            <Link
              href="/lancamento"
              prefetch={false}
              className="font-jakarta text-auth-link focus-visible:outline-auth-link inline-flex min-h-11 items-center rounded-sm font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-5"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
