"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  menuItemFormSchema,
  type MenuItemFormValues,
} from "@/schemas/menu-item-form";
import type { MenuProduct } from "@/types/menu";
import { MENU_CATEGORIES, MENU_PHOTOS } from "@/utils/contents/menu";

interface MenuItemFormProps {
  product: MenuProduct | null;
  onClose: () => void;
  onSave: (values: MenuItemFormValues) => void;
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 outline-hidden placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent-ink";
const labelClassName = "mb-1.5 block text-sm font-semibold text-stone-800";

export function MenuItemForm({ product, onClose, onSave }: MenuItemFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? product.price.toFixed(2).replace(".", ",") : "",
      category: product?.category ?? "hamburgers",
      photoId: product?.photoId ?? "none",
      active: product?.active ?? true,
      topSeller: product?.topSeller ?? false,
    },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      id="menu-item-editor"
      aria-labelledby="menu-item-editor-title"
      aria-describedby="menu-item-editor-description"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-140 overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white p-5 text-stone-900 shadow-2xl backdrop:bg-black/60 sm:p-6"
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2
          id="menu-item-editor-title"
          className="font-jakarta text-xl font-bold"
        >
          {product ? "Editar item" : "Novo item"}
        </h2>
        <button
          type="button"
          aria-label="Fechar formulário"
          onClick={close}
          className="focus-visible:outline-admin-accent-ink flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <p
        id="menu-item-editor-description"
        className="mb-5 text-sm leading-5 text-stone-600"
      >
        As alterações desta prévia ficam disponíveis até recarregar a página.
      </p>
      <form
        aria-label={product ? "Editar produto" : "Criar produto"}
        noValidate
        aria-busy={isSubmitting}
        onSubmit={handleSubmit(onSave)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="menu-name" className={labelClassName}>
            Nome do produto
          </label>
          <input
            id="menu-name"
            autoComplete="off"
            required
            maxLength={80}
            className={fieldClassName}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "menu-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="menu-name-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="menu-description" className={labelClassName}>
            Descrição
          </label>
          <textarea
            id="menu-description"
            required
            maxLength={240}
            rows={3}
            className={fieldClassName}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "menu-description-error" : undefined
            }
            {...register("description")}
          />
          {errors.description && (
            <p
              id="menu-description-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="menu-price" className={labelClassName}>
              Preço (R$)
            </label>
            <input
              id="menu-price"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="34,90"
              required
              className={fieldClassName}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? "menu-price-error" : undefined}
              {...register("price")}
            />
            {errors.price && (
              <p
                id="menu-price-error"
                role="alert"
                className="mt-1 text-sm text-red-700"
              >
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="menu-category" className={labelClassName}>
              Categoria
            </label>
            <select
              id="menu-category"
              className={fieldClassName}
              {...register("category")}
            >
              {MENU_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="menu-photo" className={labelClassName}>
            Imagem da prévia (opcional)
          </label>
          <select
            id="menu-photo"
            className={fieldClassName}
            {...register("photoId")}
          >
            <option value="none">Sem imagem</option>
            {MENU_PHOTOS.map((photo) => (
              <option key={photo.id} value={photo.id}>
                {photo.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-admin-accent-ink size-4"
              {...register("active")}
            />
            Produto ativo
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-admin-accent-ink size-4"
              {...register("topSeller")}
            />
            Marcar como destaque
          </label>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={close}
            className="h-11"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="from-home-orange h-11 rounded-lg bg-linear-[161.4deg_in_srgb] to-[#e6182a] text-black hover:opacity-90"
          >
            {isSubmitting ? "Salvando..." : "Salvar item"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
