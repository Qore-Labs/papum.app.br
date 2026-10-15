import { ApiError } from "@/lib/api/errors";
import {
  createFirmRequestSchema,
  productRequestSchema,
} from "@/schemas/api/delivery";
import type { EstablishmentFormValues } from "@/schemas/establishment-form";
import type { MenuItemFormValues } from "@/schemas/menu-item-form";
import type {
  ApiFirmType,
  CreateFirmRequest,
  ProductRequest,
} from "@/types/api";
import { ESTABLISHMENT_DAYS } from "@/utils/contents/establishment";

export function priceToCents(value: string): number {
  if (!/^\d{1,12}(?:[.,]\d{1,2})?$/.test(value)) {
    throw new ApiError(
      "invalid_price",
      "Informe um preço válido com até duas casas decimais.",
      422,
    );
  }
  const [whole, decimal = ""] = value.replace(",", ".").split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}

interface ProductApiContext {
  categoryId: number;
  preparationTime: number;
  imagePath?: string | null;
}

export function prepareProductPayload(
  values: MenuItemFormValues,
  context: ProductApiContext,
): ProductRequest {
  return productRequestSchema.parse({
    category_id: context.categoryId,
    name: values.name,
    description: values.description,
    price: priceToCents(values.price),
    active: values.active,
    preparation_time: context.preparationTime,
    image: context.imagePath,
  });
}

interface FirmApiContext {
  type: ApiFirmType;
  logoPath?: string | null;
  color?: string;
}

export function prepareFirmPayload(
  values: EstablishmentFormValues,
  context: FirmApiContext,
): CreateFirmRequest {
  const phone = values.phone.replace(/\D/g, "");
  const cnpj = values.cnpj.replace(/[.\s/-]/g, "");
  const zipcode = values.postalCode.replace(/\D/g, "");
  return createFirmRequestSchema.parse({
    name: values.name,
    type: context.type,
    phone: phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3"),
    cnpj: cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    ),
    opening_hours: `${values.openingTime} - ${values.closingTime}`,
    open_days: ESTABLISHMENT_DAYS.filter((day) => values.days.includes(day.id))
      .map((day) => day.label)
      .join(", "),
    city: values.city,
    state: values.state,
    neighborhood: values.district,
    street: values.street,
    number: values.number,
    zipcode: zipcode.replace(/^(\d{5})(\d{3})$/, "$1-$2"),
    logo: context.logoPath,
    color: context.color,
  });
}
