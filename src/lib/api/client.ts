import "server-only";

import { z } from "zod";

import { invalidApiInput, ApiError } from "@/lib/api/errors";
import { validateImageFile } from "@/lib/api/upload";
import {
  apiIdSchema,
  apiSlugSchema,
  apiResponseSchema,
  apiPageSchema,
  apiUserSchema,
  loginRequestSchema,
  loginDataSchema,
  registerRequestSchema,
  googleLoginRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  createFirmRequestSchema,
  updateFirmRequestSchema,
  firmSchema,
  publicFirmSchema,
  categoryRequestSchema,
  categorySchema,
  productRequestSchema,
  productSchema,
  publicProductSchema,
  imagePathSchema,
  uploadedImageSchema,
  orderSchema,
  customerSchema,
} from "@/schemas/api/delivery";
import type { ApiTransport } from "@/types/api";

export function parseApiInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw invalidApiInput();
  return parsed.data;
}
const id = (value: number) => parseApiInput(apiIdSchema, value);
const slug = (value: string) => parseApiInput(apiSlugSchema, value);
const pageQuery = (value: number) =>
  `page=${parseApiInput(z.number().int().positive().max(1_000_000), value)}`;

export function createDeliveryApi(transport: ApiTransport) {
  const empty = apiResponseSchema(z.null());
  return {
    auth: {
      login: (input: unknown) =>
        transport.request("login", apiResponseSchema(loginDataSchema), {
          method: "POST",
          authenticated: false,
          body: parseApiInput(loginRequestSchema, input),
        }),
      me: () => transport.request("me", apiResponseSchema(apiUserSchema)),
      logout: () => transport.request("logout", empty, { method: "POST" }),
      register: (input: unknown) =>
        transport.request("register", empty, {
          method: "POST",
          authenticated: false,
          body: parseApiInput(registerRequestSchema, input),
        }),
      googleLogin: (input: unknown) =>
        transport.request("google/login", apiResponseSchema(loginDataSchema), {
          method: "POST",
          authenticated: false,
          body: parseApiInput(googleLoginRequestSchema, input),
        }),
      forgotPassword: async (input: unknown) => {
        try {
          return await transport.request("password/forgot", empty, {
            method: "POST",
            authenticated: false,
            body: parseApiInput(forgotPasswordRequestSchema, input),
          });
        } catch (error) {
          // Present the same result for existing and unknown e-mails.
          if (
            error instanceof ApiError &&
            error.code === "error.password.forgot" &&
            error.status === 400
          )
            return { success: true as const, message: null, data: null };
          throw error;
        }
      },
      resetPassword: (input: unknown) =>
        transport.request("password/reset", empty, {
          method: "POST",
          authenticated: false,
          body: parseApiInput(resetPasswordRequestSchema, input),
        }),
    },
    firms: {
      list: () =>
        transport.request("firms", apiResponseSchema(z.array(firmSchema))),
      get: (firmId: number) =>
        transport.request(`firms/${id(firmId)}`, apiResponseSchema(firmSchema)),
      create: (input: unknown) =>
        transport.request("firms", apiResponseSchema(firmSchema), {
          method: "POST",
          body: parseApiInput(createFirmRequestSchema, input),
        }),
      // PUT/PATCH require the full body: the API does not merge partial fields.
      update: (firmId: number, input: unknown) =>
        transport.request(
          `firms/${id(firmId)}`,
          apiResponseSchema(firmSchema),
          {
            method: "PUT",
            body: parseApiInput(updateFirmRequestSchema, input),
          },
        ),
      remove: (firmId: number) =>
        transport.request(`firms/${id(firmId)}`, empty, { method: "DELETE" }),
      public: (firmSlug: string) =>
        transport.request(
          `public/firm/${slug(firmSlug)}`,
          apiResponseSchema(publicFirmSchema),
          { authenticated: false },
        ),
    },
    categories: {
      list: (firmId: number) =>
        transport.request(
          `firms/${id(firmId)}/category`,
          apiResponseSchema(z.array(categorySchema)),
        ),
      create: (firmId: number, input: unknown) =>
        transport.request(
          `firms/${id(firmId)}/category`,
          apiResponseSchema(categorySchema),
          { method: "POST", body: parseApiInput(categoryRequestSchema, input) },
        ),
      update: (firmId: number, categoryId: number, input: unknown) =>
        transport.request(
          `firms/${id(firmId)}/category/${id(categoryId)}`,
          apiResponseSchema(categorySchema),
          { method: "PUT", body: parseApiInput(categoryRequestSchema, input) },
        ),
      remove: (firmId: number, categoryId: number) =>
        transport.request(
          `firms/${id(firmId)}/category/${id(categoryId)}`,
          empty,
          { method: "DELETE" },
        ),
    },
    products: {
      get: (firmId: number, productId: number) =>
        transport.request(
          `firms/${id(firmId)}/products/${id(productId)}`,
          apiResponseSchema(productSchema),
        ),
      create: (firmId: number, input: unknown) =>
        transport.request(
          `firms/${id(firmId)}/products`,
          apiResponseSchema(productSchema),
          { method: "POST", body: parseApiInput(productRequestSchema, input) },
        ),
      update: (firmId: number, productId: number, input: unknown) =>
        transport.request(
          `firms/${id(firmId)}/products/${id(productId)}`,
          apiResponseSchema(productSchema),
          { method: "PUT", body: parseApiInput(productRequestSchema, input) },
        ),
      remove: (firmId: number, productId: number) =>
        transport.request(
          `firms/${id(firmId)}/products/${id(productId)}`,
          empty,
          { method: "DELETE" },
        ),
      public: (productSlug: string) =>
        transport.request(
          `product/${slug(productSlug)}`,
          apiResponseSchema(publicProductSchema),
          { authenticated: false },
        ),
    },
    images: {
      upload: async (firmId: number, image: unknown) => {
        const owner = id(firmId);
        const file = await validateImageFile(image);
        const form = new FormData();
        form.append("firm_id", String(owner));
        form.append("image", file);
        return transport.request(
          "images/upload",
          apiResponseSchema(uploadedImageSchema),
          { method: "POST", body: form },
        );
      },
      remove: (firmId: number, path: string) =>
        transport.request(
          `images/${encodeURIComponent(parseApiInput(imagePathSchema, path))}`,
          empty,
          { method: "DELETE", body: { firm_id: id(firmId) } },
        ),
    },
    orders: {
      list: (firmId: number, page = 1) =>
        transport.request(
          `orders/${id(firmId)}?${pageQuery(page)}`,
          apiPageSchema(orderSchema),
        ),
    },
    // The documented API has no customer create/update/delete endpoints.
    customers: {
      list: (firmId: number, page = 1) =>
        transport.request(
          `customers/${id(firmId)}?${pageQuery(page)}`,
          apiPageSchema(customerSchema),
        ),
    },
  };
}

export type DeliveryApi = ReturnType<typeof createDeliveryApi>;
