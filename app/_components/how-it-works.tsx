import {
  ScooterIcon,
  ShoppingBagIcon,
  UtensilsIcon,
} from "@/components/ui/icons";

const STEPS = [
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

export function HowItWorks() {
  return (
    <section className="bg-zinc-100 py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold text-zinc-900">
          Como funciona o Pá Pum!
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }) => (
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
  );
}
