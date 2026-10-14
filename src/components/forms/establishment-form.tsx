"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useController, useForm } from "react-hook-form";

import { EstablishmentField } from "@/components/forms/establishment-field";
import { Button } from "@/components/ui/button";
import {
  AdminCheckIcon,
  AdminStoreAddIcon,
  AdminSubmitArrowIcon,
} from "@/components/ui/icons";
import {
  establishmentFormSchema,
  ESTABLISHMENT_DEFAULT_VALUES,
  type EstablishmentFormValues,
} from "@/schemas/establishment-form";
import type { EstablishmentSectionHeading } from "@/types/establishment";
import {
  ESTABLISHMENT_ADDRESS_FIELDS,
  ESTABLISHMENT_BANKING_FIELDS,
  ESTABLISHMENT_DAYS,
  ESTABLISHMENT_INFORMATION_FIELDS,
  ESTABLISHMENT_TIME_FIELDS,
} from "@/utils/contents/establishment";

interface EstablishmentFormProps {
  heading: ReactNode;
  sectionHeadings: EstablishmentSectionHeading[];
}

const sectionClassName =
  "space-y-6 rounded-xl bg-white p-5 shadow-[0_20px_20px_rgba(0,0,0,0.03)] sm:p-8";

const fieldOrder: (keyof EstablishmentFormValues)[] = [
  ...ESTABLISHMENT_INFORMATION_FIELDS.map((field) => field.id),
  "days",
  ...ESTABLISHMENT_TIME_FIELDS.map((field) => field.id),
  ...ESTABLISHMENT_ADDRESS_FIELDS.map((field) => field.id),
  ...ESTABLISHMENT_BANKING_FIELDS.map((field) => field.id),
];

export function EstablishmentForm({
  heading,
  sectionHeadings,
}: EstablishmentFormProps) {
  const [message, setMessage] = useState("");
  const [postalMessage, setPostalMessage] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: ESTABLISHMENT_DEFAULT_VALUES,
    shouldFocusError: false,
  });
  const { field: daysField } = useController({ name: "days", control });

  function newRegistration() {
    reset(ESTABLISHMENT_DEFAULT_VALUES);
    setPostalMessage("");
    setMessage("Novo cadastro iniciado. Preencha os dados do estabelecimento.");
    // reset limpa as referências do RHF; o input permanece no DOM.
    document.getElementById("establishment-name")?.focus();
  }
  async function verifyPostalCode() {
    if (!(await trigger("postalCode", { shouldFocus: true }))) {
      setPostalMessage("");
      return;
    }
    setPostalMessage(
      "CEP com formato válido. Preencha o endereço manualmente nesta prévia.",
    );
    setFocus("street");
  }
  function submit(values: EstablishmentFormValues) {
    setMessage(
      `Cadastro de ${values.name} validado nesta prévia. Os dados ficam disponíveis até recarregar a página.`,
    );
  }
  function sectionHeading(id: EstablishmentSectionHeading["id"]) {
    return sectionHeadings.find((item) => item.id === id)?.content;
  }

  return (
    <div className="mx-auto max-w-256 px-4 pt-8 pb-3 sm:px-8">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
        {heading}
        <Button
          type="button"
          onClick={newRegistration}
          className="font-jakarta bg-admin-accent h-14 shrink-0 gap-2 rounded-xl px-6 text-base leading-6 font-bold text-white hover:bg-orange-400 md:w-67.5"
        >
          <AdminStoreAddIcon aria-hidden="true" />
          Novo Cadastro
        </Button>
      </div>
      <form
        aria-label="Cadastro de estabelecimento"
        noValidate
        onSubmit={handleSubmit(submit, (invalid) => {
          const firstInvalid = fieldOrder.find((field) => invalid[field]);
          if (firstInvalid) setFocus(firstInvalid);
        })}
        aria-busy={isSubmitting}
        className="space-y-8"
      >
        <section
          aria-labelledby="establishment-information-title"
          className={sectionClassName}
        >
          {sectionHeading("information")}
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {ESTABLISHMENT_INFORMATION_FIELDS.map((field) => (
              <EstablishmentField
                key={field.id}
                field={field}
                register={register}
                error={errors[field.id]}
              />
            ))}
          </div>
        </section>
        <section
          aria-labelledby="establishment-hours-title"
          className={sectionClassName}
        >
          {sectionHeading("hours")}
          <fieldset
            aria-describedby={
              errors.days ? "establishment-days-error" : undefined
            }
            className="min-w-0 space-y-8"
          >
            <legend className="sr-only">
              Dias e horários de funcionamento
            </legend>
            <div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {ESTABLISHMENT_DAYS.map((day) => (
                  <label
                    key={day.id}
                    className="has-focus-visible:outline-admin-accent-ink flex h-18 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-[#f3f3f3] has-checked:border-[#ffdbc9] has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
                  >
                    <span className="relative flex size-5.5 items-center justify-center">
                      <input
                        type="checkbox"
                        value={day.id}
                        name={daysField.name}
                        checked={daysField.value.includes(day.id)}
                        onChange={(event) =>
                          daysField.onChange(
                            event.currentTarget.checked
                              ? [...daysField.value, day.id]
                              : daysField.value.filter((id) => id !== day.id),
                          )
                        }
                        onBlur={daysField.onBlur}
                        ref={day.id === "mon" ? daysField.ref : undefined}
                        aria-label={day.fullName}
                        aria-invalid={!!errors.days}
                        className="peer checked:border-admin-accent-ink checked:bg-admin-accent-ink size-5.5 cursor-pointer appearance-none rounded border border-stone-500 bg-white outline-hidden"
                      />
                      <AdminCheckIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute hidden text-white peer-checked:block"
                      />
                    </span>
                    <span className="text-xs leading-4 font-semibold text-stone-600">
                      {day.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.days && (
                <p
                  id="establishment-days-error"
                  role="alert"
                  className="mt-2 text-sm text-red-700"
                >
                  {errors.days.message}
                </p>
              )}
            </div>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {ESTABLISHMENT_TIME_FIELDS.map((field) => (
                <EstablishmentField
                  key={field.id}
                  field={field}
                  register={register}
                  error={errors[field.id]}
                />
              ))}
            </div>
          </fieldset>
        </section>
        <section
          aria-labelledby="establishment-address-title"
          className={sectionClassName}
        >
          {sectionHeading("address")}
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-12">
            {ESTABLISHMENT_ADDRESS_FIELDS.map((field) => (
              <EstablishmentField
                key={field.id}
                field={field}
                register={register}
                error={errors[field.id]}
                onVerifyPostalCode={verifyPostalCode}
              />
            ))}
          </div>
          {postalMessage && (
            <p role="status" className="text-sm leading-5 text-stone-600">
              {postalMessage}
            </p>
          )}
        </section>
        <section
          aria-labelledby="establishment-banking-title"
          className={`${sectionClassName} font-arimo`}
        >
          {sectionHeading("banking")}
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {ESTABLISHMENT_BANKING_FIELDS.map((field) => (
              <EstablishmentField
                key={field.id}
                field={field}
                register={register}
                error={errors[field.id]}
                banking
              />
            ))}
          </div>
        </section>
        {message && (
          <p
            role="status"
            className="text-admin-accent-ink rounded-lg bg-orange-50 p-4 text-sm leading-6"
          >
            {message}
          </p>
        )}
        <div className="flex min-h-18.5 flex-col items-stretch justify-between gap-4 py-3.5 md:flex-row md:items-center md:gap-6">
          <p className="max-w-80 text-xs leading-5 text-stone-600">
            Os dados ficam nesta prévia até recarregar.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="focus-visible:outline-admin-accent-ink flex min-h-11 items-center justify-center rounded-xl border-2 border-stone-500 px-8 text-sm leading-5 font-medium text-stone-700 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 md:w-31.5"
            >
              Cancelar
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="from-home-orange h-11.25 gap-2 rounded-xl bg-linear-[167.67deg_in_srgb] to-[#e6182a] px-6 text-base leading-6 font-bold text-black hover:opacity-90 md:w-57.75"
            >
              {isSubmitting ? "Validando..." : "Finalizar Cadastro"}
              <AdminSubmitArrowIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
