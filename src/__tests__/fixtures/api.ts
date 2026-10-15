import type { CreateFirmRequest, ProductRequest } from "@/types/api";

export const API_FIRM_INPUT = {
  name: "Restaurante de teste",
  type: "burguer",
  phone: "(11) 91234-5678",
  cnpj: "11.222.333/0001-81",
  opening_hours: "18:00 - 02:00",
  open_days: "SEG, TER",
  city: "São Paulo",
  state: "SP",
  neighborhood: "Centro",
  street: "Rua de Teste",
  number: "123A",
  zipcode: "01001-000",
} satisfies CreateFirmRequest;

export const API_PRODUCT_INPUT = {
  name: "Produto de teste",
  category_id: 1,
  description: "Descrição do produto",
  price: 1999,
  active: true,
  preparation_time: 15,
} satisfies ProductRequest;

export function apiSuccess<T>(data: T) {
  return { success: true as const, message: null, data };
}
