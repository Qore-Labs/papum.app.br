import type { z } from "zod";

import type {
  apiPaginationSchema,
  apiUserSchema,
  categorySchema,
  createFirmRequestSchema,
  customerSchema,
  firmSchema,
  firmTypeSchema,
  orderSchema,
  productRequestSchema,
  productSchema,
  uploadedImageSchema,
} from "@/schemas/api/delivery";

export type ApiUser = z.infer<typeof apiUserSchema>;
export type ApiFirm = z.infer<typeof firmSchema>;
export type ApiFirmType = z.infer<typeof firmTypeSchema>;
export type ApiCategory = z.infer<typeof categorySchema>;
export type ApiProduct = z.infer<typeof productSchema>;
export type ApiCustomer = z.infer<typeof customerSchema>;
export type ApiOrder = z.infer<typeof orderSchema>;
export type ApiPagination = z.infer<typeof apiPaginationSchema>;
export type ApiUploadedImage = z.infer<typeof uploadedImageSchema>;
export type CreateFirmRequest = z.infer<typeof createFirmRequestSchema>;
export type ProductRequest = z.infer<typeof productRequestSchema>;

export interface ApiSuccess<T> {
  success: true;
  message: string | null;
  data: T;
}
export interface ApiPage<T> extends ApiSuccess<T[]> {
  meta: ApiPagination;
}
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface ApiRequestOptions {
  method?: ApiMethod;
  body?: unknown;
  authenticated?: boolean;
}
export interface ApiTransport {
  request<T>(
    path: string,
    schema: z.ZodType<T>,
    options?: ApiRequestOptions,
  ): Promise<T>;
}
