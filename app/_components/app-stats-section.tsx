import Image from "next/image";

const STATS = [
  { value: "+500", label: "Restaurantes" },
  { value: "+50k", label: "Pedidos/Mês" },
  { value: "4.9★", label: "Avaliação Média" },
  { value: "15 min", label: "Entrega Média" },
];

export function AppStatsSection() {
  return (
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
            {STATS.map(({ value, label }) => (
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
  );
}
