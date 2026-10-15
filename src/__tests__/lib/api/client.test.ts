// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  API_FIRM_INPUT,
  API_PRODUCT_INPUT,
  apiSuccess,
} from "@/__tests__/fixtures/api";
import { getDeliveryApi } from "@/lib/api";
import { createDeliveryApi } from "@/lib/api/client";
import { createHttpTransport } from "@/lib/api/http";
import { createMockTransport } from "@/lib/api/mock";
import { MAX_IMAGE_BYTES, validateImageFile } from "@/lib/api/upload";

const cookieMock = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({ cookies: cookieMock }));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function mockApi() {
  return createDeliveryApi(createMockTransport());
}
const png = () =>
  new File(
    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])],
    "teste.png",
    { type: "image/png" },
  );

describe("Fluxos do cliente delivery-app", () => {
  it("usa os mocks por padrão sem fetch ou leitura de sessão", async () => {
    vi.stubEnv("DELIVERY_DATA_SOURCE", undefined);
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const api = getDeliveryApi();
    expect((await api.firms.list()).data).toHaveLength(1);
    expect((await api.customers.list(1)).meta).toMatchObject({
      current_page: 1,
      per_page: 10,
    });
    expect(fetcher).not.toHaveBeenCalled();
    expect(cookieMock).not.toHaveBeenCalled();
  });
  it("mantém o CRUD do cardápio isolado por instância e valida a categoria do estabelecimento", async () => {
    const api = mockApi();
    const category = (
      await api.categories.create(1, { name: "Categoria temporária" })
    ).data;
    const item = (
      await api.products.create(1, {
        ...API_PRODUCT_INPUT,
        category_id: category.id,
      })
    ).data;
    expect(item).toMatchObject({ price: 1999, preparation_time: 15 });
    await expect(api.categories.remove(1, category.id)).rejects.toMatchObject({
      status: 409,
      code: "error.category.has_products",
    });
    const updated = (
      await api.products.update(1, item.id, {
        ...API_PRODUCT_INPUT,
        name: "Produto alterado",
        category_id: category.id,
        active: false,
      })
    ).data;
    expect(updated).toMatchObject({
      id: item.id,
      name: "Produto alterado",
      active: false,
    });
    await expect(
      api.products.public(`product-${item.id}`),
    ).rejects.toMatchObject({ status: 404 });
    expect(
      (await mockApi().categories.list(1)).data.some(
        (value) => value.id === category.id,
      ),
    ).toBe(false);
    await api.products.remove(1, item.id);
    await api.categories.remove(1, category.id);
    await expect(api.products.get(1, item.id)).rejects.toMatchObject({
      status: 404,
    });
    await expect(
      api.products.create(1, { ...API_PRODUCT_INPUT, category_id: 999 }),
    ).rejects.toMatchObject({ status: 422 });
  });
  it("separa listagem e detalhe dos estabelecimentos e omite o ID público", async () => {
    const api = mockApi();
    expect((await api.firms.list()).data[0].categories).toEqual([]);
    expect((await api.firms.get(1)).data.categories.length).toBeGreaterThan(0);
    const publicFirm = (await api.firms.public("papum-demo")).data;
    expect(publicFirm).not.toHaveProperty("id");
    expect(publicFirm.categories[0]).toHaveProperty("id");
    expect(
      publicFirm.categories
        .flatMap((value) => value.products)
        .every((value) => value.active),
    ).toBe(true);
    const created = (await api.firms.create(API_FIRM_INPUT)).data;
    expect((await api.orders.list(created.id)).data).toEqual([]);
    expect((await api.customers.list(created.id)).data).toEqual([]);
    await api.firms.update(created.id, {
      ...API_FIRM_INPUT,
      name: "Novo nome",
      cnpj: null,
    });
    expect((await api.firms.get(created.id)).data.cnpj).toBeNull();
    await api.firms.remove(created.id);
    await expect(api.firms.get(created.id)).rejects.toMatchObject({
      status: 404,
    });
  });
  it("preserva paginação na raiz e exatamente um status atual por pedido", async () => {
    const api = mockApi();
    const customers = await api.customers.list(1);
    expect(customers.data.length).toBeLessThanOrEqual(10);
    expect(customers.meta.total).toBeGreaterThan(0);
    expect((await api.customers.list(1, 999)).data).toEqual([]);
    const orders = await api.orders.list(1);
    expect(
      orders.data.every(
        (order) =>
          Number.isInteger(order.total_value) &&
          order.statuses.filter((status) => status.active).length === 1,
      ),
    ).toBe(true);
    expect(Object.keys(api.customers)).toEqual(["list"]);
  });
  it("usa os caminhos e verbos do contrato, incluindo category no singular e PUT completo", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(() =>
        Promise.resolve(Response.json(apiSuccess(null))),
      );
    const api = createDeliveryApi(
      createHttpTransport({
        baseUrl: "https://backend.example.test/api",
        getToken: () => "1|test",
        fetch: fetcher,
      }),
    );
    // Invalid response is expected here: inspect outbound requests, never bypass response validation.
    await api.categories
      .update(2, 3, { name: "Bebidas" })
      .catch(() => undefined);
    await api.products.update(2, 4, API_PRODUCT_INPUT).catch(() => undefined);
    await api.customers.list(2, 3).catch(() => undefined);
    expect(
      fetcher.mock.calls.map(([url, options]) => [
        String(url),
        options?.method,
      ]),
    ).toEqual([
      ["https://backend.example.test/api/firms/2/category/3", "PUT"],
      ["https://backend.example.test/api/firms/2/products/4", "PUT"],
      ["https://backend.example.test/api/customers/2?page=3", "GET"],
    ]);
    expect(JSON.parse(String(fetcher.mock.calls[1][1]?.body))).toEqual(
      API_PRODUCT_INPUT,
    );
    expect(() => api.products.get(-1, 1)).toThrow();
    expect(() => api.customers.list(1, 0)).toThrow();
    expect(() => api.firms.public("../private")).toThrow();
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it("normaliza recuperação de senha para não revelar e-mail inexistente", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json(
          { success: false, error: { code: "error.password.forgot" } },
          { status: 400 },
        ),
      );
    const api = createDeliveryApi(
      createHttpTransport({
        baseUrl: "https://backend.example.test/api",
        fetch: fetcher,
      }),
    );
    await expect(
      api.auth.forgotPassword({ email: "teste@example.com" }),
    ).resolves.toEqual(apiSuccess(null));
  });
});

describe("Upload de imagens", () => {
  it("envia multipart sem fixar Content-Type e codifica o path inteiro na exclusão", async () => {
    const image = {
      url: "https://assets.example.test/images/demo/teste.png",
      path: "images/demo/teste.png",
      filename: "teste.png",
      size: 12,
      mime_type: "image/png",
    };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(apiSuccess(image), { status: 201 }))
      .mockResolvedValueOnce(Response.json(apiSuccess(null)));
    const api = createDeliveryApi(
      createHttpTransport({
        baseUrl: "https://backend.example.test/api",
        getToken: () => "1|test",
        fetch: fetcher,
      }),
    );
    expect((await api.images.upload(1, png())).data.path).toBe(image.path);
    const upload = fetcher.mock.calls[0][1];
    expect(upload?.body).toBeInstanceOf(FormData);
    expect((upload?.body as FormData).get("firm_id")).toBe("1");
    expect(new Headers(upload?.headers).has("Content-Type")).toBe(false);
    await api.images.remove(1, image.path);
    expect(String(fetcher.mock.calls[1][0])).toBe(
      "https://backend.example.test/api/images/images%2Fdemo%2Fteste.png",
    );
    expect(fetcher.mock.calls[1][1]).toMatchObject({
      method: "DELETE",
      body: '{"firm_id":1}',
    });
  });
  it("valida tipo, tamanho e assinatura antes de transmitir o arquivo", async () => {
    await expect(validateImageFile(png())).resolves.toBeInstanceOf(File);
    await expect(
      validateImageFile(
        new File(["<svg/>"], "vetor.svg", { type: "image/svg+xml" }),
      ),
    ).rejects.toMatchObject({ status: 422 });
    await expect(
      validateImageFile(
        new File(["conteúdo falso"], "falso.png", { type: "image/png" }),
      ),
    ).rejects.toMatchObject({ status: 422 });
    await expect(
      validateImageFile(new File([], "vazio.png", { type: "image/png" })),
    ).rejects.toMatchObject({ status: 422 });
    await expect(
      validateImageFile(
        new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "grande.png", {
          type: "image/png",
        }),
      ),
    ).rejects.toMatchObject({ status: 422 });
    const fetcher = vi.fn<typeof fetch>();
    const api = createDeliveryApi(
      createHttpTransport({
        baseUrl: "https://backend.example.test/api",
        fetch: fetcher,
      }),
    );
    await expect(
      api.images.upload(
        1,
        new File(["falso"], "falso.png", { type: "image/png" }),
      ),
    ).rejects.toMatchObject({ code: "invalid_image" });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("simula limite de 30 imagens por estabelecimento e exclusão", async () => {
    const api = mockApi();
    const first = (await api.images.upload(1, png())).data;
    for (let i = 1; i < 30; i++) await api.images.upload(1, png());
    await expect(api.images.upload(1, png())).rejects.toMatchObject({
      status: 403,
    });
    await api.images.remove(1, first.path);
    await expect(api.images.upload(1, png())).resolves.toHaveProperty(
      "data.path",
    );
  });

  it("preserva a imagem quando a atualização não informa esse campo e permite removê-la com null", async () => {
    const api = mockApi();
    const image = (await api.images.upload(1, png())).data;
    const item = (
      await api.products.create(1, { ...API_PRODUCT_INPUT, image: image.path })
    ).data;
    expect(
      (await api.products.update(1, item.id, API_PRODUCT_INPUT)).data.image,
    ).toBe(image.path);
    expect(
      (
        await api.products.update(1, item.id, {
          ...API_PRODUCT_INPUT,
          image: null,
        })
      ).data.image,
    ).toBeNull();
  });
});
