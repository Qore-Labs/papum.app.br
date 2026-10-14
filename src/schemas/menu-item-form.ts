import { z } from "zod";

import { MENU_PHOTOS } from "@/utils/contents/menu";

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Use até 80 caracteres no nome."),
  description: z
    .string()
    .trim()
    .min(3, "Descreva o produto com pelo menos 3 caracteres.")
    .max(240, "Use até 240 caracteres na descrição."),
  price: z
    .string()
    .trim()
    .regex(/^\d{1,5}(?:[.,]\d{1,2})?$/, "Informe um preço válido, como 34,90.")
    .refine(
      (value) => Number(value.replace(",", ".")) > 0,
      "O preço deve ser maior que zero.",
    ),
  category: z.enum(["hamburgers", "pizzas", "pokes", "drinks"]),
  photoId: z
    .string()
    .refine(
      (value) =>
        value === "none" || MENU_PHOTOS.some((photo) => photo.id === value),
      "Escolha uma imagem da prévia ou selecione sem imagem.",
    ),
  active: z.boolean(),
  topSeller: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;
