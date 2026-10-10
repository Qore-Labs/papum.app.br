import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { siteConfig } from "@/utils/config/site";

export const metadata: Metadata = {
  title: `Entrar | ${siteConfig.name}`,
};

export default function LoginPage() {
  return (
    <main className="flex flex-1">
      <div className="relative hidden overflow-hidden lg:block lg:flex-1">
        <Image
          src="/login/branding-food.png"
          alt="Pratos deliciosos prontos para entrega"
          fill
          sizes="(min-width: 1024px) 60vw, 0vw"
          priority
          className="object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12 lg:w-[533px] lg:shrink-0">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="relative aspect-[304.34/86.357] w-full max-w-[304.34px] self-center overflow-hidden">
            <Image
              src="/login/papum-logo-lockup.png"
              alt={siteConfig.name}
              width={1920}
              height={1080}
              priority
              className="absolute top-[-59.48%] left-[-8.7%] h-[232.5%] w-[117.29%] max-w-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-jakarta text-brand-ink text-[32px] font-extrabold tracking-[-0.9px]">
              Bem-vindo de volta!
            </h1>
            <p className="font-vietnam text-brand-muted text-base opacity-80">
              Entre para pedir seus pratos favoritos.
            </p>
          </div>

          <LoginForm />

          <div className="relative flex items-center justify-center">
            <div className="border-brand-muted/30 absolute inset-x-0 top-1/2 border-t" />
            <span className="font-jakarta text-brand-muted relative bg-white px-4 text-sm opacity-70">
              Ou continue com
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="border-brand-muted/20 font-jakarta text-brand-ink focus-visible:outline-brand-orange flex items-center justify-center gap-3 rounded-xl border bg-[#f5f3f3] px-4 py-3.5 text-sm font-semibold shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Image
                src="/login/google-icon.svg"
                alt=""
                width={20}
                height={20}
              />
              Entrar com Google
            </button>
            <button
              type="button"
              className="border-brand-muted/20 font-jakarta text-brand-ink focus-visible:outline-brand-orange flex items-center justify-center gap-3 rounded-xl border bg-[#f5f3f3] px-4 py-3.5 text-sm font-semibold shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Image
                src="/login/facebook-icon.svg"
                alt=""
                width={20}
                height={20}
              />
              Entrar com Facebook
            </button>
          </div>

          <p className="font-vietnam text-brand-muted text-center text-sm">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-jakarta text-brand-red focus-visible:outline-brand-orange rounded-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
