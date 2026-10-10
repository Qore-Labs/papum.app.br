import { z } from "zod";

export const waitlistFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .max(254, "O e-mail deve ter no máximo 254 caracteres.")
    .toLowerCase(),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
