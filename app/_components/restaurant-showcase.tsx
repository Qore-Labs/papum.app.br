import Image from "next/image";

import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/ui/icons";

export function RestaurantShowcase() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div className="from-brand-orange to-brand-red relative overflow-hidden rounded-3xl bg-gradient-to-br p-10">
          <div className="relative z-10 max-w-sm">
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Os melhores restaurantes estão aqui!
            </h2>
            <p className="mt-4 text-sm text-white/90">
              De lanches rápidos a jantares gourmet, Nos conectamos você a todas
              as mesas da cidade.
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
  );
}
