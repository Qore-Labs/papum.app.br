import { describe, expect, it } from "vitest";

import { API_FIRM_INPUT, API_PRODUCT_INPUT } from "@/__tests__/fixtures/api";
import {
  prepareFirmPayload,
  prepareProductPayload,
  priceToCents,
} from "@/lib/api/adapters";
import {
  createFirmRequestSchema,
  productRequestSchema,
  updateFirmRequestSchema,
  registerRequestSchema,
  productSchema,
  imagePathSchema,
} from "@/schemas/api/delivery";
import { ESTABLISHMENT_DEFAULT_VALUES } from "@/schemas/establishment-form";

describe("Contratos da API delivery-app", () => {
  it.each([
    ["0,29", 29],
    ["1.15", 115],
    ["34,90", 3490],
    ["120", 12000],
    ["0", 0],
  ])(
    "converte %s em %i centavos sem arredondamento binário",
    (input, cents) => {
      expect(priceToCents(input)).toBe(cents);
    },
  );
  it.each(["1.234", "-10", "NaN", "1e3", "1,2,3"])(
    "recusa preço ambíguo %s",
    (input) => {
      expect(() => priceToCents(input)).toThrow();
    },
  );
  it("exige categoria numérica e tempo de preparo no payload de produto", () => {
    expect(productRequestSchema.safeParse(API_PRODUCT_INPUT).success).toBe(
      true,
    );
    expect(
      productRequestSchema.safeParse({
        ...API_PRODUCT_INPUT,
        category_id: "hamburgers",
      }).success,
    ).toBe(false);
    expect(
      productRequestSchema.safeParse({
        ...API_PRODUCT_INPUT,
        preparation_time: undefined,
      }).success,
    ).toBe(false);
    expect(
      productRequestSchema.safeParse({ ...API_PRODUCT_INPUT, firm_id: 999 })
        .success,
    ).toBe(false);
  });
  it("recusa preços decimais do exemplo conflitante da documentação", () => {
    expect(
      productSchema.safeParse({
        ...API_PRODUCT_INPUT,
        id: 1,
        image: null,
        price: "25.90",
      }).success,
    ).toBe(false);
    expect(
      productRequestSchema.safeParse({ ...API_PRODUCT_INPUT, price: 19.99 })
        .success,
    ).toBe(false);
  });
  it("não trata PUT como atualização parcial", () => {
    expect(
      updateFirmRequestSchema.safeParse({ name: "Nova empresa" }).success,
    ).toBe(false);
    expect(
      updateFirmRequestSchema.safeParse({ ...API_FIRM_INPUT, cnpj: null })
        .success,
    ).toBe(true);
  });
  it("mantém os valores exatos do FirmType e CNPJ documentados", () => {
    expect(createFirmRequestSchema.safeParse(API_FIRM_INPUT).success).toBe(
      true,
    );
    expect(
      createFirmRequestSchema.safeParse({ ...API_FIRM_INPUT, type: "burgers" })
        .success,
    ).toBe(false);
    expect(
      createFirmRequestSchema.safeParse({
        ...API_FIRM_INPUT,
        cnpj: "12.ABC.345/01DE-35",
      }).success,
    ).toBe(false);
  });
  it("valida a confirmação de senha com confirm_password", () => {
    expect(
      registerRequestSchema.safeParse({
        name: "Pessoa Teste",
        email: "teste@example.com",
        password: "senha-de-teste",
        confirm_password: "outra-senha",
      }).success,
    ).toBe(false);
  });
  it("mapeia o item sem enviar campos exclusivos da prévia", () => {
    const result = prepareProductPayload(
      {
        name: "Suco",
        description: "Suco natural",
        price: "1,15",
        category: "drinks",
        photoId: "none",
        topSeller: true,
        active: true,
      },
      { categoryId: 10, preparationTime: 5 },
    );
    expect(result).toMatchObject({
      category_id: 10,
      price: 115,
      preparation_time: 5,
    });
    expect(result).not.toHaveProperty("topSeller");
    expect(result).not.toHaveProperty("photoId");
    expect(result).not.toHaveProperty("firm_id");
  });
  it("mapeia estabelecimento sem enviar dados bancários ou complemento", () => {
    const input = {
      ...ESTABLISHMENT_DEFAULT_VALUES,
      name: "Empresa Teste",
      phone: "11912345678",
      cnpj: "11222333000181",
      days: ["mon", "tue"] as ("mon" | "tue")[],
      openingTime: "18:00",
      closingTime: "02:00",
      city: "São Paulo",
      state: "SP",
      district: "Centro",
      street: "Rua de Teste",
      number: "S/N",
      postalCode: "01001000",
      bank: "bb",
      accountNumber: "12345-6",
      holderDocument: "documento-privado",
      complement: "Apto 1",
    };
    const result = prepareFirmPayload(input, { type: "burguer" });
    expect(result).toMatchObject({
      phone: "(11) 91234-5678",
      cnpj: "11.222.333/0001-81",
      zipcode: "01001-000",
      opening_hours: "18:00 - 02:00",
      open_days: "SEG, TER",
      neighborhood: "Centro",
    });
    expect(JSON.stringify(result)).not.toContain("documento-privado");
    expect(result).not.toHaveProperty("bank");
    expect(result).not.toHaveProperty("accountNumber");
    expect(result).not.toHaveProperty("complement");
    expect(() =>
      prepareFirmPayload(
        { ...input, cnpj: "12.ABC.345/01DE-35" },
        { type: "burguer" },
      ),
    ).toThrow();
  });
  it.each([
    "../private",
    "images/../private.jpg",
    "images/demo/%2e%2e.jpg",
    "https://evil.test/x.jpg",
    "images/demo/x.jpg?other=1",
    "images\\demo\\x.jpg",
  ])("recusa path de imagem inseguro %s", (path) => {
    expect(imagePathSchema.safeParse(path).success).toBe(false);
  });
});
