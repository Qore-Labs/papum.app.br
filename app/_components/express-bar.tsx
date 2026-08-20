import { Button } from "@/components/ui/button";
import { LightningIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const PARTNER_BRANDS = [
  { first: "BURGER", second: "KING", secondColor: "text-red-600" },
  { first: "SUSHI", second: "ZEN", secondColor: "text-emerald-600" },
  { first: "PIZZA", second: "HUT", secondColor: "text-red-600" },
  { first: "SUB", second: "WAY", secondColor: "text-brand-orange" },
  { first: "GIRAFFAS", second: "", secondColor: "", underline: true },
];

export function ExpressBar() {
  return (
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
  );
}
