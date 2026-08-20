import Image from "next/image";

export function HeroSection() {
  return (
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
  );
}
