import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "A mensagem deve ter ao menos 10 caracteres"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
