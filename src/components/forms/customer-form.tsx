"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customer-form";
import type { Customer } from "@/types/customers";
import { CUSTOMER_STATUSES } from "@/utils/contents/customers";

interface CustomerFormProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: (values: CustomerFormValues) => void;
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 outline-hidden placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent-ink";
const labelClassName = "mb-1.5 block text-sm font-semibold text-stone-800";

export function CustomerForm({ customer, onClose, onSave }: CustomerFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      status: customer?.status ?? "active",
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
      id="customer-editor"
      aria-labelledby="customer-editor-title"
      aria-describedby="customer-editor-description"
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
          id="customer-editor-title"
          className="font-jakarta text-xl font-bold"
        >
          {customer ? "Editar cliente" : "Novo cliente"}
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
        id="customer-editor-description"
        className="mb-5 text-sm leading-5 text-stone-600"
      >
        As alterações desta prévia ficam disponíveis até recarregar a página.
      </p>
      <form
        aria-label={
          customer ? "Editar cadastro do cliente" : "Cadastrar cliente"
        }
        noValidate
        aria-busy={isSubmitting}
        onSubmit={handleSubmit(onSave)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="customer-name" className={labelClassName}>
            Nome completo
          </label>
          <input
            id="customer-name"
            autoComplete="name"
            required
            maxLength={80}
            className={fieldClassName}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "customer-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="customer-name-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="customer-email" className={labelClassName}>
            E-mail
          </label>
          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            className={fieldClassName}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "customer-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="customer-email-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="customer-phone" className={labelClassName}>
            Telefone com DDD
          </label>
          <input
            id="customer-phone"
            type="tel"
            autoComplete="tel-national"
            placeholder="(11) 98765-4321"
            required
            maxLength={25}
            className={fieldClassName}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "customer-phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p
              id="customer-phone-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="customer-status" className={labelClassName}>
            Status do cliente
          </label>
          <select
            id="customer-status"
            className={fieldClassName}
            {...register("status")}
          >
            <option value="active">{CUSTOMER_STATUSES.active.label}</option>
            <option value="vip">{CUSTOMER_STATUSES.vip.label}</option>
            <option value="inactive">{CUSTOMER_STATUSES.inactive.label}</option>
          </select>
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
            className="bg-admin-accent h-11 rounded-lg text-stone-950 hover:bg-orange-400"
          >
            {isSubmitting ? "Salvando..." : "Salvar cliente"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
