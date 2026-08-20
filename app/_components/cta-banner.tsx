import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
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
  );
}
