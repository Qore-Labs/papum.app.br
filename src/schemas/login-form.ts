import { z } from "zod";

export const loginFormSchema = z.object({
  identifier: z.string().min(1, "Informe seu email ou telefone"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
