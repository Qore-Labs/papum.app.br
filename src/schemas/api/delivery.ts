import { z } from "zod";

import { isValidCnpj } from "@/lib/brazilian-document";

export const apiIdSchema = z.number().int().positive().safe();
export const apiSlugSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const centsSchema = z.number().int().nonnegative().safe();
export const apiTokenSchema = z
  .string()
  .min(1)
  .max(3000)
  .regex(/^[\x21-\x7e]+$/);
const timestamp = z.string().datetime({ offset: true });
const email = z.string().trim().email().max(254).toLowerCase();

export const apiPaginationSchema = z.object({
  current_page: z.number().int().positive(),
  last_page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export function apiResponseSchema<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    success: z.literal(true),
    message: z.string().nullable(),
    data,
  });
}

export function apiPageSchema<T extends z.ZodTypeAny>(item: T) {
  return apiResponseSchema(z.array(item)).extend({ meta: apiPaginationSchema });
}

export const apiUserSchema = z.object({
  id: apiIdSchema,
  name: z.string(),
  email,
});
export const loginRequestSchema = z
  .object({ email, password: z.string().min(1).max(1024) })
  .strict();
export const loginDataSchema = z.object({ access_token: apiTokenSchema });
export const registerRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    email: email.refine((value) => value.length <= 150),
    password: z.string().min(8).max(1024),
    confirm_password: z.string().min(8).max(1024),
  })
  .strict()
  .refine((value) => value.password === value.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas devem ser iguais.",
  });
export const googleLoginRequestSchema = z
  .object({ token: z.string().min(1).max(10000) })
  .strict();
export const forgotPasswordRequestSchema = z.object({ email }).strict();
export const resetPasswordRequestSchema = z
  .object({
    email,
    token: z.string().min(1).max(1024),
    password: z.string().min(8).max(1024),
    confirm_password: z.string().min(8).max(1024),
  })
  .strict()
  .refine((value) => value.password === value.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas devem ser iguais.",
  });

export const firmTypeSchema = z.enum([
  "burguer",
  "pizzeria",
  "sushi",
  "vegetarian",
  "fast_food",
  "italian",
  "mexican",
  "chinese",
  "indian",
  "fine_dining",
  "pasta",
  "cafe",
  "candy",
  "ice_cream",
]);

export const imagePathSchema = z
  .string()
  .min(1)
  .max(1024)
  .refine(
    (value) =>
      value.startsWith("images/") &&
      !/[\\%?#:\x00-\x1f\x7f]/.test(value) &&
      value
        .split("/")
        .every(
          (segment) => segment !== "" && segment !== "." && segment !== "..",
        ),
    "O caminho da imagem deve ser o path retornado pelo upload.",
  );
const httpsImageUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  });
const imageReference = z
  .string()
  .max(2048)
  .refine((value) => {
    if (imagePathSchema.safeParse(value).success) return true;
    return httpsImageUrl.safeParse(value).success;
  });

export const productRequestSchema = z
  .object({
    category_id: apiIdSchema,
    name: z.string().trim().min(1).max(255),
    description: z.string().max(10000).optional(),
    image: imagePathSchema.nullable().optional(),
    price: centsSchema,
    active: z.boolean(),
    preparation_time: z.number().int().nonnegative().safe(),
  })
  .strict();
export const productSchema = z.object({
  id: apiIdSchema,
  name: z.string(),
  description: z.string().nullable().optional(),
  price: centsSchema,
  image: imageReference.nullable(),
  active: z.boolean(),
  preparation_time: z.number().int().nonnegative(),
});
export const publicProductSchema = productSchema.omit({ id: true });
export const categoryRequestSchema = z
  .object({ name: z.string().trim().min(1).max(255) })
  .strict();
export const categorySchema = z.object({
  id: apiIdSchema,
  name: z.string(),
  products: z.array(productSchema),
});

const firmFields = {
  name: z.string().trim().min(3).max(255),
  type: firmTypeSchema,
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  color: z
    .string()
    .regex(/^#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/)
    .optional(),
  logo: imagePathSchema.nullable().optional(),
  opening_hours: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d - (?:[01]\d|2[0-3]):[0-5]\d$/),
  open_days: z.string().trim().min(1).max(100),
  city: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[\p{L}\p{M} ]+$/u),
  state: z.string().regex(/^[A-Z]{2}$/),
  neighborhood: z.string().trim().min(2).max(100),
  street: z.string().trim().min(3).max(255),
  number: z.string().regex(/^(?:\d+[a-zA-Z]?|S\/N)$/),
  zipcode: z.string().regex(/^\d{5}-\d{3}$/),
};
const numericCnpj = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  .refine(isValidCnpj);
export const createFirmRequestSchema = z
  .object({ ...firmFields, cnpj: numericCnpj })
  .strict();
export const updateFirmRequestSchema = z
  .object({ ...firmFields, cnpj: numericCnpj.nullable().optional() })
  .strict();
export const firmSchema = z.object({
  id: apiIdSchema,
  slug: apiSlugSchema,
  name: z.string(),
  type: firmTypeSchema,
  phone: z.string(),
  cnpj: z.string().nullable(),
  color: z.string().nullable().optional(),
  logo: imageReference.nullable(),
  opening_hours: z.string(),
  open_days: z.string(),
  city: z.string(),
  state: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.string(),
  zipcode: z.string(),
  categories: z.array(categorySchema),
});
export const publicFirmSchema = firmSchema.omit({ id: true });
export const customerAddressSchema = z.object({
  country: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  complement: z.string().nullable(),
});
export const orderCustomerSchema = z.object({
  id: apiIdSchema,
  name: z.string(),
  email,
  phone: z.string(),
  created_at: timestamp,
});
export const customerSchema = orderCustomerSchema.extend({
  addresses: z.array(customerAddressSchema),
});
export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);
export const orderSchema = z
  .object({
    id: apiIdSchema,
    customer: orderCustomerSchema,
    firm_id: apiIdSchema,
    total_value: centsSchema,
    statuses: z.array(
      z.object({
        id: apiIdSchema,
        status: orderStatusSchema,
        active: z.boolean(),
        created_at: timestamp,
      }),
    ),
    created_at: timestamp,
  })
  .refine(
    (value) => value.statuses.filter((status) => status.active).length === 1,
    {
      path: ["statuses"],
      message: "O pedido deve ter exatamente um status atual.",
    },
  );
export const uploadedImageSchema = z.object({
  url: httpsImageUrl,
  path: imagePathSchema,
  filename: z.string(),
  size: z.number().int().positive(),
  mime_type: z.enum([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ]),
});
