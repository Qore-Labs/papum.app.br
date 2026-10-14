import type { FieldError, UseFormRegister } from "react-hook-form";

import {
  AdminBankSelectArrowIcon,
  AdminPostalSearchIcon,
  AdminSelectArrowIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  ESTABLISHMENT_DEFAULT_VALUES,
  type EstablishmentFormValues,
} from "@/schemas/establishment-form";
import type { EstablishmentField as EstablishmentFieldDefinition } from "@/types/establishment";

interface EstablishmentFieldProps {
  field: EstablishmentFieldDefinition;
  register: UseFormRegister<EstablishmentFormValues>;
  error?: FieldError;
  banking?: boolean;
  onVerifyPostalCode?: () => void;
}

const inputClassName =
  "min-h-11 w-full rounded-lg border border-stone-500 bg-admin-field px-4 py-2.5 text-base leading-5 font-medium text-stone-900 outline-hidden placeholder:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent-ink sm:text-sm";

export function EstablishmentField({
  field,
  register,
  error,
  banking,
  onVerifyPostalCode,
}: EstablishmentFieldProps) {
  const id = `establishment-${field.id}`;
  const shared = {
    id,
    required: !field.optional,
    autoComplete: field.autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  return (
    <div className={cn("min-h-16.25 min-w-0", field.className)}>
      <label
        htmlFor={id}
        className="mb-1 block pl-1 text-xs leading-3.75 font-semibold tracking-[0.5px] text-stone-600 uppercase sm:text-[10px]"
      >
        {field.label}
      </label>
      <div className="relative">
        {field.kind === "select" ? (
          <>
            <select
              {...shared}
              {...register(field.id)}
              defaultValue={ESTABLISHMENT_DEFAULT_VALUES[field.id]}
              className={cn(inputClassName, "appearance-none pr-12")}
            >
              {field.placeholder && (
                <option value="">{field.placeholder}</option>
              )}
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-4 flex size-5.25 -translate-y-1/2 items-center justify-center text-stone-600">
              {banking ? (
                <AdminBankSelectArrowIcon aria-hidden="true" />
              ) : (
                <AdminSelectArrowIcon aria-hidden="true" />
              )}
            </span>
          </>
        ) : (
          <input
            {...shared}
            {...register(field.id)}
            type={field.kind === "time" ? "time" : (field.type ?? "text")}
            inputMode={field.inputMode}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            className={cn(
              inputClassName,
              field.kind === "postal" && "pr-14",
              field.kind === "time" && "h-11.25",
            )}
          />
        )}
        {field.kind === "postal" && (
          <button
            type="button"
            aria-label="Verificar CEP"
            onClick={onVerifyPostalCode}
            className="text-admin-accent-ink focus-visible:outline-admin-accent-ink absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-lg hover:bg-stone-300 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <AdminPostalSearchIcon aria-hidden="true" />
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm leading-5 text-red-700"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
