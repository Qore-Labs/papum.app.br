import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LightningIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  APP_STATS,
  HOW_IT_WORKS_STEPS,
  PARTNER_BRANDS,
  TESTIMONIAL_STARS,
  type AppStat,
  type HowItWorksStep,
  type PartnerBrand,
} from "@/utils/contents/home";

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-orange";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function PartnerBrandLabel({ brand }: { brand: PartnerBrand }) {
  return (
    <span
      className={cn(
        "text-home-ink text-xl font-extrabold tracking-tight whitespace-nowrap sm:text-2xl",
        brand.widthClass,
        brand.underline && "decoration-home-red underline underline-offset-4",
      )}
    >
      {brand.first}
      {brand.second && (
        <span className={brand.secondColor}>{brand.second}</span>
      )}
    </span>
  );
}

function HowItWorksStepCard({ step }: { step: HowItWorksStep }) {
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_-4px_rgba(27,28,28,0.06)]">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="font-jakarta text-home-ink mt-6 text-[clamp(1.25rem,2vw,1.5rem)] leading-8 font-bold">
        {step.title}
      </h3>
      <p className="text-home-ink/70 mt-6 max-w-xs text-base leading-[26px]">
        {step.description}
      </p>
    </div>
  );
}

function AppStatCard({ stat }: { stat: AppStat }) {
  return (
    <div className="flex min-h-34 flex-col justify-center rounded-3xl bg-[#efeded] px-6 py-5 sm:px-8">
      <p className="text-home-red flex items-center gap-1 text-[clamp(1.75rem,3vw,2.25rem)] leading-10 font-bold whitespace-nowrap">
        {stat.value}
        {stat.star && <StarIcon className="size-5" aria-hidden="true" />}
      </p>
      <p className="text-home-ink/70 mt-2 text-sm leading-6 font-semibold whitespace-nowrap sm:text-base">
        {stat.label}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-175 items-center overflow-hidden bg-[#10191b] pt-20 pb-10 max-md:min-h-0 max-md:pt-32 max-md:pb-0">
        <Image
          src="/home/night-city-speed.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_31%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1b1c1c]/95 via-[#1b1c1c]/45 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-250 grid-cols-2 items-center gap-14 px-8 max-md:grid-cols-1 max-md:gap-3 max-sm:px-6">
          <div className="z-10 md:-translate-y-2">
            <h1 className="max-w-112 text-[clamp(3rem,5.6vw,4.5rem)] leading-none font-extrabold tracking-[-0.025em] text-white">
              Seu <br />
              delivery <br />
              <span className="text-home-orange">tá no ar.</span>
            </h1>
            <p className="mt-6 max-w-120 text-lg leading-[1.625] text-zinc-300 sm:text-xl">
              Monte seu cardápio virtual em minutos. <br />
              Simples, rápido e sem complicação. <br />O seu delivery na
              velocidade que você precisa.
            </p>
          </div>
          <Image
            src="/home/hero-scooter.png"
            alt="Scooter amarela de entrega"
            width={493}
            height={494}
            priority
            sizes="(min-width: 768px) 40vw, 90vw"
            className="relative z-10 h-auto w-full max-w-123 justify-self-end max-md:mx-auto max-md:max-w-100 md:translate-y-[46px] xl:w-[493px] xl:max-w-none xl:translate-x-[14px] xl:justify-self-start"
          />
        </div>
      </section>

      <section
        className="bg-[#e7e7e7] py-14 xl:pt-20 xl:pb-[29px]"
        aria-labelledby="speed-title"
      >
        <div className="mx-auto max-w-320 px-6">
          <div className="mx-auto flex max-w-266 items-center gap-12 max-md:flex-wrap max-md:justify-center max-md:gap-6 xl:max-w-[1060px]">
            <div className="flex items-center gap-4">
              <span className="border-home-orange flex size-16 shrink-0 items-center justify-center rounded-full border-[3px]">
                <LightningIcon className="h-7 w-6" aria-hidden="true" />
              </span>
              <h2
                id="speed-title"
                className="font-jakarta text-home-ink text-[clamp(1.4rem,3vw,1.875rem)] leading-9 font-bold whitespace-nowrap"
              >
                Rápido como um raio!
              </h2>
            </div>
            <div className="bg-home-ink/70 h-px min-w-10 flex-1 max-md:hidden xl:ml-6" />
            <a
              href="#como-funciona"
              className={cn(
                "bg-home-red rounded-lg px-[22px] py-[11px] text-center text-base leading-6 font-semibold text-white transition-colors hover:bg-red-800 motion-reduce:transition-none",
                focusClass,
              )}
            >
              ENTREGA EXPRESSA
            </a>
          </div>
          <div className="mx-auto mt-12 flex max-w-282 flex-wrap items-center justify-between gap-x-6 gap-y-5 opacity-60 max-lg:justify-center xl:max-w-[1128px] xl:gap-x-[106px]">
            {PARTNER_BRANDS.map((brand) => (
              <PartnerBrandLabel key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#faf9f9] px-6 py-8 xl:h-[520px]"
        aria-label="Restaurantes parceiros"
      >
        <div className="mx-auto grid max-w-[1232px] grid-cols-[2fr_1fr] gap-8 max-lg:grid-cols-1 xl:grid-cols-[27fr_13fr]">
          <div className="relative flex min-h-112.5 flex-col justify-between overflow-hidden rounded-[40px] bg-linear-150 from-[#ff8a00] to-[#e6182a] px-12 pt-14 pb-12 max-sm:min-h-145 max-sm:p-8">
            <Image
              src="/home/pizza-showcase.png"
              alt=""
              width={601}
              height={450}
              sizes="(min-width: 1024px) 47vw, 90vw"
              className="absolute inset-y-0 right-0 h-full w-auto max-sm:top-auto max-sm:h-auto max-sm:w-[90%] md:top-auto md:-right-16 md:bottom-0 md:h-[85%] lg:-right-32 xl:right-0 xl:h-full"
            />
            <div className="relative z-10 max-w-105">
              <h2 className="text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.11] font-extrabold text-white">
                Os melhores <br />
                restaurantes <br />
                estão aqui!
              </h2>
              <p className="mt-3 max-w-68 text-lg leading-7 text-white/85">
                De lanches rápidos a jantares gourmet, Nos conectamos você a
                todas as mesas da cidade.
              </p>
            </div>
            <Link
              href="/planos"
              className={cn(
                "relative z-10 w-fit rounded-full bg-white px-10 py-3 text-center text-base leading-6 font-semibold text-[#613100] transition-colors hover:bg-orange-50 motion-reduce:transition-none",
                focusClass,
              )}
            >
              Explorar Planos
            </Link>
          </div>

          <figure className="relative flex min-h-112.5 flex-col items-center text-center">
            <div className="absolute inset-x-0 top-15 bottom-0 rounded-[40px] bg-[#e8e8e8] shadow-[0_8px_24px_-4px_rgba(27,28,28,0.06)]" />
            <Image
              src="/home/silvas-pizza-logo.png"
              alt=""
              width={196}
              height={196}
              className="relative size-49 rounded-full object-cover"
            />
            <figcaption className="text-home-ink relative mt-2 text-[22px] leading-8 font-semibold">
              Silva’s Pizza
            </figcaption>
            <p className="text-home-ink/60 relative mt-1.5 text-sm leading-5">
              Cliente desde 2022
            </p>
            <div
              className="relative mt-[30px] flex"
              role="img"
              aria-label="Avaliação: 5 de 5 estrelas"
            >
              {TESTIMONIAL_STARS.map((star) => (
                <StarIcon
                  key={star}
                  className="h-[19px] w-5"
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote className="text-home-ink/80 relative mt-5 max-w-[306px] text-left text-xl leading-[1.625] font-medium">
              Lorem ipsum dolor sit amet consectetur. Sed suspendisse eget
              faucibus sit. Vel molestie.
            </blockquote>
          </figure>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-t-5 border-[#fb8d01] bg-[#f1f1f1] px-6 pt-14 pb-19 max-md:pb-20 xl:pb-[75px]"
      >
        <div className="mx-auto max-w-320 text-center">
          <h2 className="text-home-ink text-[clamp(1.875rem,3vw,2.25rem)] leading-10 font-extrabold">
            Como funciona o Pá Pum!
          </h2>
          <div className="mx-auto mt-20 grid max-w-255 grid-cols-3 gap-9 max-md:mt-12 max-md:grid-cols-1 max-md:gap-12">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <HowItWorksStepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden bg-white px-6 pt-24 pb-20 max-md:py-20 xl:pb-[79px]"
        aria-labelledby="social-proof-title"
      >
        <div className="mx-auto grid max-w-244 grid-cols-2 items-center gap-5 max-md:grid-cols-1 max-md:gap-16">
          <div className="relative w-80 max-w-full max-md:mx-auto">
            <div
              className="bg-home-orange/20 absolute top-20 -left-10 size-64 rounded-full blur-[32px]"
              aria-hidden="true"
            />
            <div
              className="bg-home-orange absolute bottom-10 -left-14 h-[588px] w-[434px] rounded-[217px] blur-[79px]"
              aria-hidden="true"
            />
            <div className="relative aspect-[1/2] w-full overflow-hidden rounded-[56px] border-12 border-[#18181b] bg-[#faf9f9] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <Image
                src="/home/app-screen.png"
                alt="Prévia da página inicial do aplicativo PáPum!"
                fill
                sizes="(min-width: 768px) 296px, 85vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div>
            <h2
              id="social-proof-title"
              className="text-home-ink text-[clamp(2rem,3.1vw,2.5rem)] leading-[1.12] font-bold"
            >
              Milhares de pessoas <br />
              <span className="text-[clamp(2.25rem,3.75vw,3rem)] font-extrabold text-[#dc2626]">
                já estão pedindo.
              </span>
            </h2>
            <p className="text-home-ink/70 mt-5 max-w-120 text-lg leading-7 xl:-translate-y-2">
              Nossa comunidade não para de crescer.{" "}
              <br className="hidden xl:block" /> Junte-se à{" "}
              <strong className="font-semibold">
                revolução do delivery rápido e inteligente.
              </strong>
            </p>
            <div className="mt-12 grid max-w-102 grid-cols-2 gap-8 max-sm:gap-4 xl:mt-[37px]">
              {APP_STATS.map((stat) => (
                <AppStatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-9" aria-labelledby="final-cta-title">
        <div className="relative mx-auto flex min-h-108 w-11/12 max-w-260 items-center overflow-visible rounded-[23px] bg-linear-to-r from-[#09090b] to-[#27272a] px-14 py-16 max-md:w-full max-md:overflow-hidden max-md:bg-[#09090b] max-md:px-8 max-md:pt-80 max-md:pb-14 xl:translate-x-4">
          <Image
            src="/home/entre-agora-e-monte.jpg"
            alt="Entregadora sorrindo com uma sacola de pedidos"
            width={411}
            height={364}
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 1px, 100vw"
            className="absolute -left-10 h-91 w-102.75 rounded-2xl object-cover object-center max-md:inset-x-0 max-md:top-0 max-md:bottom-auto max-md:h-72 max-md:w-full max-md:object-top md:hidden lg:block"
          />
          <div
            className="absolute inset-x-0 top-44 h-28 bg-linear-to-b from-transparent to-[#09090b] md:hidden"
            aria-hidden="true"
          />
          <div
            className="absolute top-0 right-0 size-96 rounded-full bg-[#343123]/60 blur-[60px] max-md:hidden"
            aria-hidden="true"
          />
          <div className="relative ml-auto w-full max-w-120 text-center max-md:mx-auto xl:max-w-137 xl:-translate-x-4 xl:translate-y-1">
            <h2
              id="final-cta-title"
              className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-extrabold text-white"
            >
              Entre agora e monte <br className="max-sm:hidden" /> o seu
              delivery
            </h2>
            <p className="mx-auto mt-8 max-w-137 text-lg leading-7 text-zinc-400">
              Seu primeiro mês é por nossa conta. <br />
              Use a plataforma{" "}
              <strong className="text-home-orange font-semibold">
                PAPUM!
              </strong>{" "}
              e descubra como é fácil vender
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 xl:mt-[29px] xl:translate-x-[5px]">
              <Link
                href="/login"
                className={cn(
                  "bg-home-red rounded-full px-10 py-4 text-center text-base leading-6 font-semibold text-white transition-colors hover:bg-red-800 motion-reduce:transition-none xl:px-12",
                  focusClass,
                )}
              >
                Começar Agora
              </Link>
              <Link
                href="/planos"
                className={cn(
                  "rounded-full border-2 border-white px-10 py-4 text-center text-base leading-6 font-semibold text-white transition-colors hover:bg-white/10 motion-reduce:transition-none xl:px-[43px]",
                  focusClass,
                )}
              >
                Ver Planos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
