import { ImageOff } from "lucide-react";
import type { ReactNode } from "react";

import { AdminEditIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { MenuProduct } from "@/types/menu";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface MenuProductCardProps {
  product: MenuProduct;
  photo: ReactNode;
  onToggle: () => void;
  onEdit: () => void;
}

export function MenuProductCard({
  product,
  photo,
  onToggle,
  onEdit,
}: MenuProductCardProps) {
  return (
    <article
      id={`menu-item-${product.id}`}
      tabIndex={-1}
      aria-labelledby={`menu-item-title-${product.id}`}
      className="focus-visible:outline-admin-accent-ink flex min-w-0 flex-col gap-2 rounded-xl bg-white p-4.25 shadow-xs outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[270/192] shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {photo || (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-stone-600">
            <ImageOff aria-hidden="true" className="size-5" />
            Sem imagem
          </div>
        )}
        {product.topSeller && (
          <span className="py-0.625 absolute top-2.25 right-3 rounded-full bg-white/90 px-2 text-[10px] leading-3.75 font-semibold tracking-[0.5px] text-stone-800 uppercase backdrop-blur-[6px]">
            Top seller
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0 pt-2">
        <h3
          id={`menu-item-title-${product.id}`}
          className="font-jakarta min-w-0 text-lg leading-7 font-bold wrap-break-word"
        >
          {product.name}
        </h3>
        <p className="font-jakarta text-admin-accent-ink shrink-0 text-base leading-7 font-extrabold tabular-nums">
          {currencyFormatter.format(product.price)}
        </p>
      </div>
      <p className="min-h-13.75 pb-4 text-xs leading-[19.5px] wrap-break-word text-stone-500">
        {product.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-50 pt-4.25">
        <button
          type="button"
          role="switch"
          aria-checked={product.active}
          aria-label={`Disponibilidade de ${product.name}`}
          onClick={onToggle}
          className="focus-visible:outline-admin-accent-ink flex min-h-11 items-center gap-2 rounded-sm text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 lg:min-h-6"
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full ring-1 ring-inset",
              product.active
                ? "bg-admin-accent ring-admin-accent-ink"
                : "bg-stone-300 ring-stone-500",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-4 rounded-full border border-white bg-white",
                product.active && "translate-x-4",
              )}
            />
          </span>
          <span className="text-[11px] leading-4.25 font-semibold tracking-[0.275px] uppercase">
            {product.active ? "Ativo" : "Inativo"}
          </span>
        </button>
        <button
          type="button"
          aria-label={`Editar ${product.name}`}
          aria-haspopup="dialog"
          onClick={onEdit}
          className="focus-visible:outline-admin-accent-ink flex min-h-11 items-center gap-1.5 rounded-sm text-xs leading-4 font-semibold text-stone-500 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 lg:min-h-6"
        >
          <AdminEditIcon aria-hidden="true" />
          Editar
        </button>
      </div>
    </article>
  );
}
