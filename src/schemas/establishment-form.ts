import { z } from "zod";

import { isValidCnpj, isValidCpf } from "@/lib/brazilian-document";
import type { EstablishmentOption } from "@/types/establishment";
import {
  ACCOUNT_TYPE_OPTIONS,
  BANK_OPTIONS,
  CUISINE_OPTIONS,
  STATE_OPTIONS,
} from "@/utils/contents/establishment";

function choice(options: readonly EstablishmentOption[], message: string) {
  return z
    .string()
    .refine(
      (value) => options.some((option) => option.value === value),
      message,
    );
}
function requiredText(label: string, max = 100) {
  return z
    .string()
    .trim()
    .min(2, `Informe ${label}.`)
    .max(max, `Use até ${max} caracteres.`);
}
const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe um horário válido.");

export const establishmentFormSchema = z
  .object({
    name: requiredText("o nome do estabelecimento"),
    cuisine: choice(CUISINE_OPTIONS, "Selecione o tipo de cozinha."),
    phone: z
      .string()
      .trim()
      .max(25)
      .refine(
        (value) =>
          /^[\d\s()+.-]+$/.test(value) &&
          [10, 11].includes(value.replace(/\D/g, "").length),
        "Informe um telefone com DDD e 10 ou 11 dígitos.",
      ),
    cnpj: z
      .string()
      .trim()
      .toUpperCase()
      .refine(isValidCnpj, "Informe um CNPJ válido."),
    days: z
      .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
      .min(1, "Selecione pelo menos um dia de funcionamento."),
    openingTime: time,
    closingTime: time,
    postalCode: z
      .string()
      .trim()
      .regex(/^\d{5}-?\d{3}$/, "Informe um CEP com 8 dígitos."),
    street: requiredText("a rua ou logradouro", 150),
    number: z
      .string()
      .trim()
      .min(1, "Informe o número ou S/N.")
      .max(12, "Use até 12 caracteres."),
    complement: z.string().trim().max(100, "Use até 100 caracteres."),
    district: requiredText("o bairro"),
    city: requiredText("a cidade"),
    state: choice(STATE_OPTIONS, "Selecione o estado."),
    bank: choice(BANK_OPTIONS, "Selecione o banco."),
    accountType: choice(ACCOUNT_TYPE_OPTIONS, "Selecione o tipo de conta."),
    agency: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^\d{1,6}(?:-[\dX])?$/,
        "Informe a agência, com o dígito quando houver.",
      ),
    accountNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^\d{1,12}(?:-[\dX])?$/,
        "Informe a conta, com o dígito quando houver.",
      ),
    holderName: requiredText("o nome do titular"),
    holderDocument: z
      .string()
      .trim()
      .toUpperCase()
      .refine(
        (value) => isValidCpf(value) || isValidCnpj(value),
        "Informe um CPF ou CNPJ válido para o titular.",
      ),
  })
  .refine(
    (values) =>
      !values.openingTime ||
      !values.closingTime ||
      values.openingTime !== values.closingTime,
    {
      path: ["closingTime"],
      message: "Informe horários diferentes para abertura e fechamento.",
    },
  );

export type EstablishmentFormValues = z.infer<typeof establishmentFormSchema>;

export const ESTABLISHMENT_DEFAULT_VALUES: EstablishmentFormValues = {
  name: "",
  cuisine: "",
  phone: "",
  cnpj: "",
  days: ["sun"],
  openingTime: "",
  closingTime: "",
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "RS",
  bank: "",
  accountType: "",
  agency: "",
  accountNumber: "",
  holderName: "",
  holderDocument: "",
};
