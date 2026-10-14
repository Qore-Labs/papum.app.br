import { z } from "zod";

export const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Use até 80 caracteres."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(254, "Use até 254 caracteres."),
  phone: z
    .string()
    .trim()
    .max(25, "Use até 25 caracteres.")
    .refine(
      (value) =>
        /^[\d\s()+.-]+$/.test(value) &&
        [10, 11].includes(value.replace(/\D/g, "").length),
      "Informe um telefone com DDD e 10 ou 11 dígitos.",
    ),
  status: z.enum(["vip", "active", "inactive"]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
