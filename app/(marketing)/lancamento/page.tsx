import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { WaitlistForm } from "@/components/forms/waitlist-form";
import { LogoWhite } from "@/components/ui/icons";
import { subscribeToLaunch } from "@/lib/actions/subscribe-to-launch";
import { siteConfig } from "@/utils/config/site";
import { LAUNCH_STATS } from "@/utils/contents/launch";

const title = `Lançamento em breve | ${siteConfig.name} Delivery`;
const description =
  "Seu delivery tá quase no ar. Cadastre seu e-mail para saber quando o Pápum! Delivery lançar e acompanhe uma nova forma de vender e pedir comida.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/lancamento" },
  openGraph: {
    title,
    description,
    url: "/lancamento",
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/marketing/lancamento/delivery-night.png",
        width: 1688,
        height: 952,
        alt: "Entregador do Pápum! Delivery em movimento pela cidade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/marketing/lancamento/delivery-night.png"],
  },
};

export default function LancamentoPage() {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#161616] text-white lg:min-h-[max(849px,100svh)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.34]">
          <Image
            src="/marketing/lancamento/delivery-night.png"
            alt=""
            width={1688}
            height={952}
            preload
            sizes="(min-width: 1024px) 134vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover object-[45%_center] lg:inset-auto lg:-top-[11.67%] lg:-left-[32.53%] lg:h-[111.75%] lg:w-[133.55%] lg:max-w-none lg:object-fill"
          />
        </div>
        <div className="absolute -top-[357.2px] left-1/2 h-[951.4px] w-[3786.4px] -translate-x-1/2 bg-[url('/marketing/lancamento/top-shade.svg')] bg-no-repeat" />
        <div className="absolute top-[314.8px] left-1/2 h-[951.4px] w-[3786.4px] -translate-x-1/2 rotate-180 bg-[url('/marketing/lancamento/bottom-shade.svg')] bg-no-repeat" />
        <div className="absolute top-[26.5px] left-[calc(50%-11.5px)] h-[1002px] w-[1092px] -translate-x-1/2 bg-[url('/marketing/lancamento/central-glow.svg')] bg-no-repeat" />
      </div>

      <header className="flex h-40 shrink-0 items-center justify-center px-6 py-4 sm:h-49.75">
        <Link
          href="/"
          prefetch={false}
          aria-label={`${siteConfig.name} — página inicial`}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <LogoWhite
            aria-hidden="true"
            className="h-auto w-64 text-white sm:w-84"
          />
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-168 flex-1 flex-col items-center px-6 pb-10 text-center sm:px-0">
        <div className="flex h-16 shrink-0 justify-center sm:h-20">
          <p className="text-home-orange flex h-fit items-center gap-2 rounded-full border border-[#ff8a00]/30 bg-[#ff8a00]/21 px-5 py-2 text-sm leading-5 font-semibold tracking-[0.35px] uppercase">
            <span
              aria-hidden="true"
              className="bg-home-orange size-2 rounded-full opacity-51"
            />
            Lançamento em breve
          </p>
        </div>

        <h1 className="text-[clamp(2.25rem,10.25vw,2.5rem)] leading-[0.95] font-extrabold tracking-[-0.025em] sm:text-[clamp(2.5rem,6vw,3.75rem)]">
          Seu delivery
          <span className="text-home-orange block">tá quase no ar.</span>
        </h1>
        <p className="mt-4 max-w-128 text-base leading-7 text-zinc-300 sm:text-xl sm:leading-[32.5px]">
          Obrigado pelo seu interesse! Estamos trabalhando para revolucionar o
          delivery rápido e inteligente. Seja o primeiro a saber quando
          lançarmos.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <WaitlistForm
            subscribeAction={subscribeToLaunch}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>

        <p className="mt-8 mb-3 max-w-full text-sm leading-5 text-zinc-400">
          Junte-se a mais de{" "}
          <strong className="font-semibold text-zinc-300">
            500 restaurantes
          </strong>{" "}
          aguardando o lançamento
        </p>
        <dl className="grid w-full grid-cols-3 items-center justify-center gap-3 rounded-[14px] bg-[#141414]/65 px-4 py-5 mix-blend-plus-lighter sm:flex sm:h-17.5 sm:w-143.5 sm:gap-8 sm:px-0 sm:pt-6 sm:pb-[17px]">
          {LAUNCH_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-xs leading-5 text-zinc-300 sm:text-sm sm:whitespace-nowrap">
                {stat.label}
              </dt>
              <dd className="text-brand-red order-1 text-2xl leading-[30px] font-extrabold whitespace-nowrap sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </main>

      <footer className="relative flex flex-col items-center justify-center gap-2 border-t border-white/38 px-6 py-6 text-center text-xs leading-5 sm:flex-row sm:gap-6 sm:text-sm">
        <p>
          © {new Date().getFullYear()} PáPum! Delivery. Todos os direitos
          reservados.
        </p>
        {/^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID ?? "") && (
          <button
            type="button"
            data-analytics-preferences
            aria-controls="analytics-preferences"
            className="min-h-11 text-sm text-zinc-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Preferências de privacidade
          </button>
        )}
      </footer>
    </div>
  );
}
