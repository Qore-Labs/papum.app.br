"use client";

import { useState, type ReactNode } from "react";

import { MenuProductCard } from "@/components/dashboard/menu-product-card";
import { MenuItemForm } from "@/components/forms/menu-item-form";
import { AdminToolbar } from "@/components/layout/admin-toolbar";
import { Button } from "@/components/ui/button";
import { AdminAddIcon, AdminSearchIcon } from "@/components/ui/icons";
import { filterMenuProducts } from "@/lib/menu";
import { cn } from "@/lib/utils";
import type { MenuItemFormValues } from "@/schemas/menu-item-form";
import type {
  MenuFilterId,
  MenuPhotoPresentation,
  MenuProduct,
} from "@/types/menu";
import { MENU_CATEGORIES, MENU_FILTERS } from "@/utils/contents/menu";

interface MenuWorkspaceProps {
  initialProducts: MenuProduct[];
  photos: MenuPhotoPresentation[];
  heading: ReactNode;
  toolbarActions: ReactNode;
}

export function MenuWorkspace({
  initialProducts,
  photos,
  heading,
  toolbarActions,
}: MenuWorkspaceProps) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MenuFilterId>("all");
  const [editor, setEditor] = useState<MenuProduct | "new" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const visibleProducts = filterMenuProducts(products, query, category);

  function saveProduct(values: MenuItemFormValues) {
    const id = editor && editor !== "new" ? editor.id : crypto.randomUUID();
    const product: MenuProduct = {
      id,
      name: values.name,
      description: values.description,
      price: Number(values.price.replace(",", ".")),
      category: values.category,
      photoId: photos.find((photo) => photo.id === values.photoId)?.id ?? null,
      active: values.active,
      topSeller: values.topSeller,
    };
    setProducts((current) =>
      current.some((item) => item.id === id)
        ? current.map((item) => (item.id === id ? product : item))
        : [...current, product],
    );
    setQuery("");
    setCategory("all");
    setEditor(null);
    setAnnouncement(`${product.name} salvo nesta prévia.`);
    requestAnimationFrame(() =>
      document.getElementById(`menu-item-${id}`)?.focus(),
    );
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setAnnouncement("");
  }

  return (
    <>
      <AdminToolbar actions={toolbarActions}>
        <div
          role="search"
          aria-label="Busca de pratos"
          className="relative min-w-0 flex-1 lg:max-w-112"
        >
          <label htmlFor="menu-search" className="sr-only">
            Buscar pratos
          </label>
          <AdminSearchIcon
            aria-hidden="true"
            className="text-home-orange pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setAnnouncement("");
            }}
            placeholder="Buscar pratos..."
            autoComplete="off"
            className="bg-admin-input focus-visible:outline-admin-accent-ink h-11 w-full rounded-xl py-3 pr-4 pl-12 text-base text-stone-900 outline-hidden placeholder:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 lg:h-10 lg:text-sm"
          />
        </div>
      </AdminToolbar>
      <div className="space-y-8 px-4 pt-7 pb-6 sm:px-8 lg:pt-0">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          {heading}
          <Button
            type="button"
            onClick={() => setEditor("new")}
            aria-haspopup="dialog"
            className="from-home-orange h-12 shrink-0 gap-2 rounded-xl bg-linear-[161.4deg_in_srgb] to-[#e6182a] px-6 text-base leading-6 font-semibold text-white shadow-[0_10px_15px_-3px_rgba(154,70,0,0.2),0_4px_6px_-4px_rgba(154,70,0,0.2)] hover:opacity-90"
          >
            <AdminAddIcon aria-hidden="true" />
            Novo Item
          </Button>
        </div>
        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="flex flex-wrap gap-3 pb-2"
        >
          {MENU_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={category === filter.id}
              onClick={() => {
                setCategory(filter.id);
                setAnnouncement("");
              }}
              className={cn(
                "focus-visible:outline-admin-accent-ink min-h-11 rounded-full px-5 py-2 text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 lg:min-h-9",
                category === filter.id
                  ? "bg-admin-accent font-semibold text-stone-900 shadow-xs"
                  : "bg-admin-control font-medium text-stone-600 hover:bg-stone-300",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p role="status" className="sr-only">
          {announcement ||
            `${visibleProducts.length} ${visibleProducts.length === 1 ? "item encontrado" : "itens encontrados"}.`}
        </p>
        {MENU_CATEGORIES.map((section) => {
          const items = visibleProducts.filter(
            (product) => product.category === section.id,
          );
          if (!items.length) return null;
          return (
            <section
              key={section.id}
              aria-labelledby={`menu-category-${section.id}`}
              className="space-y-6"
            >
              <div className="mx-auto flex max-w-223.25 items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-0.5 min-w-0 flex-1 bg-[#c8c8c8]"
                />
                <h2
                  id={`menu-category-${section.id}`}
                  className="font-jakarta text-xs leading-4 font-bold tracking-[3.6px] text-stone-600 uppercase"
                >
                  {section.heading}
                </h2>
                <span
                  aria-hidden="true"
                  className="h-0.5 min-w-0 flex-1 bg-[#c8c8c8]"
                />
              </div>
              <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <MenuProductCard
                    key={product.id}
                    product={product}
                    photo={
                      photos.find((photo) => photo.id === product.photoId)
                        ?.image
                    }
                    onEdit={() => setEditor(product)}
                    onToggle={() => {
                      setProducts((current) =>
                        current.map((item) =>
                          item.id === product.id
                            ? { ...item, active: !item.active }
                            : item,
                        ),
                      );
                      setAnnouncement(
                        `${product.name} ${product.active ? "desativado" : "ativado"} nesta prévia.`,
                      );
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
        {!visibleProducts.length && (
          <div className="rounded-xl bg-white px-6 py-12 text-center">
            <h2 className="font-jakarta text-lg font-bold">
              {category === "drinks" && !query.trim()
                ? "Nenhuma bebida cadastrada"
                : "Nenhum prato encontrado"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {category === "drinks" && !query.trim()
                ? "Use Novo Item para incluir uma bebida nesta prévia."
                : "Tente outro nome ou selecione outra categoria."}
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={resetFilters}
              className="mt-5 h-11"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
      {editor !== null && (
        <MenuItemForm
          key={editor === "new" ? "new" : editor.id}
          product={editor === "new" ? null : editor}
          onClose={() => setEditor(null)}
          onSave={saveProduct}
        />
      )}
    </>
  );
}
