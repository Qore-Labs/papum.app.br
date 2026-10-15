import "server-only";

import { ApiError } from "@/lib/api/errors";
import { parseApiInput } from "@/lib/api/client";
import {
  categoryRequestSchema,
  createFirmRequestSchema,
  updateFirmRequestSchema,
  productRequestSchema,
} from "@/schemas/api/delivery";
import type {
  ApiCustomer,
  ApiFirm,
  ApiOrder,
  ApiProduct,
  ApiTransport,
  ApiUploadedImage,
} from "@/types/api";
import { CUSTOMER_DEMO_DATA } from "@/utils/contents/customers";
import { DASHBOARD_DEMO_ORDERS } from "@/utils/contents/dashboard";
import { MENU_CATEGORIES, MENU_DEMO_PRODUCTS } from "@/utils/contents/menu";

const createdAt = "2026-08-14T21:06:27.000000Z";
const user = { id: 1, name: "Marcus V.", email: "gerente@papum.test" };

function initialFirm(): ApiFirm {
  return {
    id: 1,
    slug: "papum-demo",
    name: "Casa de Chico",
    type: "burguer",
    phone: "(11) 91234-5678",
    cnpj: "11.222.333/0001-81",
    color: "#FF8A00",
    logo: null,
    opening_hours: "18:00 - 23:00",
    open_days: "SEG, TER, QUA, QUI, SEX, SÁB, DOM",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Centro",
    street: "Rua Exemplo",
    number: "123",
    zipcode: "01001-000",
    categories: MENU_CATEGORIES.map((category, index) => ({
      id: index + 1,
      name: category.label,
      products: MENU_DEMO_PRODUCTS.flatMap((product, productIndex) =>
        product.category !== category.id
          ? []
          : [
              {
                id: productIndex + 1,
                name: product.name,
                description: product.description,
                price: Math.round(product.price * 100),
                image: null,
                active: product.active,
                preparation_time: 0,
              },
            ],
      ),
    })),
  };
}

export function createMockTransport(): ApiTransport {
  // Each instance is isolated: no shared in-memory state between users/requests.
  let firms = [initialFirm()];
  let nextId = 100;
  const images = new Map<string, { firmId: number; image: ApiUploadedImage }>();
  const customers: ApiCustomer[] = CUSTOMER_DEMO_DATA.map(
    (customer, index) => ({
      id: index + 1,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      addresses: [],
      created_at: createdAt,
    }),
  );
  const orders: ApiOrder[] = DASHBOARD_DEMO_ORDERS.map((order, index) => ({
    id: index + 1,
    customer: { ...customers[index % customers.length], name: order.customer },
    firm_id: 1,
    total_value: Math.round(order.amount * 100),
    created_at: createdAt,
    statuses: [
      {
        id: index + 1,
        status:
          order.status === "in-transit"
            ? "shipped"
            : order.status === "delivered"
              ? "delivered"
              : "confirmed",
        active: true,
        created_at: createdAt,
      },
    ],
  }));
  const success = (data: unknown) => ({ success: true, message: null, data });
  const notFound = () =>
    new ApiError(
      "firm.not.found",
      "O recurso não foi encontrado ou não está disponível para sua conta.",
      404,
    );
  function firmById(id: number) {
    const firm = firms.find((item) => item.id === id);
    if (!firm) throw notFound();
    return firm;
  }
  function paginate<T>(data: T[], page: number) {
    return {
      ...success(data.slice((page - 1) * 10, page * 10)),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(data.length / 10)),
        per_page: 10,
        total: data.length,
      },
    };
  }
  function dispatch(path: string, method: string, body: unknown): unknown {
    const url = new URL(path, "https://mock.papum.test/api/");
    const route = url.pathname.slice(5);
    if (route === "login" || route === "google/login")
      return success({ access_token: "mock-only-not-a-real-session" });
    if (route === "me") return success(user);
    if (
      ["logout", "register", "password/forgot", "password/reset"].includes(
        route,
      )
    )
      return success(null);
    if (route === "firms") {
      if (method === "GET")
        return success(firms.map((firm) => ({ ...firm, categories: [] })));
      const input = parseApiInput(createFirmRequestSchema, body);
      const firm: ApiFirm = {
        ...input,
        id: nextId++,
        slug: `demo-${nextId}`,
        logo: input.logo ?? null,
        categories: [],
      };
      firms.push(firm);
      return success(firm);
    }
    if (route.startsWith("public/firm/")) {
      const firm = firms.find((item) => item.slug === route.slice(12));
      if (!firm) throw notFound();
      return success({
        ...firm,
        categories: firm.categories.map((category) => ({
          ...category,
          products: category.products.filter((product) => product.active),
        })),
      });
    }
    if (route.startsWith("product/")) {
      const productId = Number(route.slice(8).replace(/^product-/, ""));
      const product = firms
        .flatMap((firm) =>
          firm.categories.flatMap((category) => category.products),
        )
        .find((product) => product.id === productId && product.active);
      if (!product)
        throw new ApiError(
          "error.product.not_found",
          "Produto não encontrado.",
          404,
        );
      return success(product);
    }
    const paginated = /^(orders|customers)\/(\d+)$/.exec(route);
    if (paginated) {
      const firmId = Number(paginated[2]);
      firmById(firmId);
      return paginate<ApiOrder | ApiCustomer>(
        paginated[1] === "orders"
          ? orders.filter((order) => order.firm_id === firmId)
          : firmId === 1
            ? customers
            : [],
        Number(url.searchParams.get("page") ?? 1),
      );
    }
    if (route === "images/upload" && body instanceof FormData) {
      const firmId = Number(body.get("firm_id"));
      firmById(firmId);
      if (
        [...images.values()].filter((image) => image.firmId === firmId)
          .length >= 30
      ) {
        throw new ApiError(
          "you.have.reached.the.maximum.number.of.images",
          "Limite de 30 imagens atingido.",
          403,
        );
      }
      const file = body.get("image");
      if (!(file instanceof File))
        throw new ApiError("invalid_image", "Imagem inválida.", 422);
      const extensions: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      const filename = `mock-${nextId++}.${extensions[file.type]}`;
      const image: ApiUploadedImage = {
        filename,
        path: `images/demo/${filename}`,
        url: `https://assets.papum.test/images/demo/${filename}`,
        size: file.size,
        mime_type: file.type as ApiUploadedImage["mime_type"],
      };
      images.set(image.path, { firmId, image });
      return success(image);
    }
    if (route.startsWith("images/") && method === "DELETE") {
      const path = decodeURIComponent(route.slice(7));
      const firmId = (body as { firm_id: number }).firm_id;
      firmById(firmId);
      if (images.get(path)?.firmId !== firmId) throw notFound();
      images.delete(path);
      return success(null);
    }
    const nested = /^firms\/(\d+)(?:\/(category|products)(?:\/(\d+))?)?$/.exec(
      route,
    );
    if (!nested) throw notFound();
    const firm = firmById(Number(nested[1]));
    const resource = nested[2];
    const resourceId = Number(nested[3]);
    if (!resource) {
      if (method === "DELETE") {
        firms = firms.filter((item) => item !== firm);
        return success(null);
      }
      if (method === "PUT")
        Object.assign(firm, parseApiInput(updateFirmRequestSchema, body));
      return success(firm);
    }
    if (resource === "category") {
      if (!resourceId && method === "GET") return success(firm.categories);
      if (method === "POST") {
        const category = {
          id: nextId++,
          ...parseApiInput(categoryRequestSchema, body),
          products: [],
        };
        firm.categories.push(category);
        return success(category);
      }
      const category = firm.categories.find((item) => item.id === resourceId);
      if (!category) throw notFound();
      if (method === "DELETE") {
        if (category.products.length)
          throw new ApiError(
            "error.category.has_products",
            "Remova os produtos da categoria primeiro.",
            409,
          );
        firm.categories = firm.categories.filter((item) => item !== category);
        return success(null);
      }
      Object.assign(category, parseApiInput(categoryRequestSchema, body));
      return success(category);
    }
    const currentCategory = firm.categories.find((category) =>
      category.products.some((product) => product.id === resourceId),
    );
    const current = currentCategory?.products.find(
      (product) => product.id === resourceId,
    );
    if (method === "GET") {
      if (!current) throw notFound();
      return success(current);
    }
    if (method === "DELETE") {
      if (!current || !currentCategory) throw notFound();
      currentCategory.products = currentCategory.products.filter(
        (product) => product !== current,
      );
      return success(null);
    }
    const input = parseApiInput(productRequestSchema, body);
    const targetCategory = firm.categories.find(
      (category) => category.id === input.category_id,
    );
    if (!targetCategory)
      throw new ApiError("validation_error", "Categoria inválida.", 422, {
        category_id: ["Selecione uma categoria deste estabelecimento."],
      });
    if (method === "PUT" && !current) throw notFound();
    const product: ApiProduct = {
      ...current,
      ...input,
      id: current?.id ?? nextId++,
      image: input.image === undefined ? (current?.image ?? null) : input.image,
    };
    if (currentCategory)
      currentCategory.products = currentCategory.products.filter(
        (product) => product !== current,
      );
    targetCategory.products.push(product);
    return success(product);
  }
  return {
    async request(path, schema, options = {}) {
      // Parse every mock response through the same contract as the HTTP transport.
      const body =
        options.body === undefined || options.body instanceof FormData
          ? options.body
          : (JSON.parse(JSON.stringify(options.body)) as unknown);
      return structuredClone(
        schema.parse(dispatch(path, options.method ?? "GET", body)),
      );
    },
  };
}
