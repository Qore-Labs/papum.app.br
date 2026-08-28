import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  LightningIcon,
  ScooterIcon,
  ShoppingBagIcon,
  StarIcon,
  UtensilsIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const PARTNER_BRANDS = [
  { first: "BURGER", second: "KING", secondColor: "text-red-600" },
  { first: "SUSHI", second: "ZEN", secondColor: "text-emerald-600" },
  { first: "PIZZA", second: "HUT", secondColor: "text-red-600" },
  { first: "SUB", second: "WAY", secondColor: "text-brand-orange" },
  { first: "GIRAFFAS", second: "", secondColor: "", underline: true },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: UtensilsIcon,
    title: "1. Crie seu cardápio",
    description:
      "Crie e personalize o seu cardápio virtual de maneira rápida e fácil",
  },
  {
    icon: ShoppingBagIcon,
    title: "2. Escolha um plano",
    description: "Escolha o melhor plano de atendimento para seu restaurante",
  },
  {
    icon: ScooterIcon,
    title: "3. Venda",
    description: "Venda, acompanhe e organize seu movimento de caixa",
  },
];

const APP_STATS = [
  { value: "+500", label: "Restaurantes" },
  { value: "+50k", label: "Pedidos/Mês" },
  { value: "4.9★", label: "Avaliação Média" },
  { value: "15 min", label: "Entrega Média" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0e1a24] py-20 sm:py-28">
        <Image
          src="/home/hero-city-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1a24] via-[#0e1a24]/85 to-[#0e1a24]/20" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h1 className="font-heading text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
              Seu delivery
              <br />
              <span className="text-brand-orange">tá no ar.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-white/80">
              Monte seu cardápio virtual em minutos. Simples, rápido e sem
              complicação. O seu delivery na velocidade que você precisa.
            </p>
          </div>

          <div className="relative aspect-square w-full lg:aspect-video">
            <Image
              src="/home/hero-scooter.png"
              alt="Scooter de entrega amarelo"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Barra "entrega expressa" + marcas parceiras */}
      <section className="bg-zinc-100 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="border-brand-orange flex size-10 items-center justify-center rounded-full border-2">
                <LightningIcon className="size-5" />
              </span>
              <span className="font-heading text-lg font-bold text-zinc-800">
                Rápido como um raio!
              </span>
            </div>
            <div className="mx-6 hidden h-px flex-1 bg-zinc-300 sm:block" />
            <Button variant="danger" size="sm" className="rounded-md">
              ENTREGA EXPRESSA
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-zinc-200 pt-6">
            {PARTNER_BRANDS.map(({ first, second, secondColor, underline }) => (
              <span
                key={first}
                className={cn(
                  "text-sm font-bold tracking-wide text-zinc-700",
                  underline && "underline underline-offset-4",
                )}
              >
                {first}
                <span className={secondColor}>{second}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Vitrine de restaurantes */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
          <div className="from-brand-orange to-brand-red relative overflow-hidden rounded-3xl bg-gradient-to-br p-10">
            <div className="relative z-10 max-w-sm">
              <h2 className="font-heading text-3xl font-extrabold text-white">
                Os melhores restaurantes estão aqui!
              </h2>
              <p className="mt-4 text-sm text-white/90">
                De lanches rápidos a jantares gourmet, Nos conectamos você a
                todas as mesas da cidade.
              </p>
              <Button variant="accent" size="md" className="mt-6 rounded-full">
                Explorar Planos
              </Button>
            </div>

            <Image
              src="/home/pizza-showcase.png"
              alt="Pizza de pepperoni"
              width={601}
              height={450}
              className="absolute inset-y-0 right-0 hidden h-full w-72 object-cover sm:block"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-3xl bg-zinc-100 p-8">
            <Image
              src="/home/silvas-pizza-logo.png"
              alt="Logo Silva's Pizza"
              width={196}
              height={196}
              className="size-20 rounded-full object-cover"
            />
            <div>
              <p className="font-heading text-lg font-bold text-zinc-900">
                Silva&apos;s Pizza
              </p>
              <p className="text-sm text-zinc-500">Cliente desde 2022</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} className="size-4" />
              ))}
            </div>
            <p className="text-sm text-zinc-600">
              Lorem ipsum dolor sit amet consectetur. Sed suspendisse eget
              faucibus sit. Vel molestie.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-zinc-100 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-zinc-900">
            Como funciona o Pá Pum!
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center gap-4">
                <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-heading text-base font-bold text-zinc-900">
                  {title}
                </h3>
                <p className="max-w-56 text-sm text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas do app */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative mx-auto aspect-9/19 w-64 rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-[1.75rem]">
              <Image
                src="/home/app-screen.png"
                alt="Tela do app Pápum!"
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Milhares de pessoas
              <br />
              <span className="text-brand-red">já estão pedindo.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-zinc-500">
              Nossa comunidade não para de crescer. Junte-se à revolução do
              delivery rápido e inteligente.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {APP_STATS.map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-zinc-100 p-5">
                  <p className="font-heading text-brand-red text-2xl font-extrabold">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="from-brand-dark via-brand-dark to-brand-orange/20 mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br px-8 py-16 text-center sm:px-16">
          <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
            Entre agora e monte
            <br />o seu delivery
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70">
            Seu primeiro mês é por nossa conta. Use a plataforma{" "}
            <span className="text-brand-orange">PAPUM!</span> e descubra como é
            fácil vender
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="danger" size="lg" className="rounded-full">
              Começar Agora
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Ver Planos
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
