import { describe, expect, it } from "vitest";

import { isValidCnpj, isValidCpf } from "@/lib/brazilian-document";
import {
  establishmentFormSchema,
  ESTABLISHMENT_DEFAULT_VALUES,
} from "@/schemas/establishment-form";

describe("documentos brasileiros", () => {
  it("valida CPF com ou sem pontuação", () => {
    expect(isValidCpf("111.444.777-35")).toBe(true);
    expect(isValidCpf("11144477735")).toBe(true);
    expect(isValidCpf("11144477736")).toBe(false);
    expect(isValidCpf("00000000000")).toBe(false);
  });
  it("valida CNPJ numérico e o exemplo alfanumérico do manual oficial", () => {
    expect(isValidCnpj("12.345.678/0001-95")).toBe(true);
    expect(isValidCnpj("12.ABC.345/01DE-35")).toBe(true);
    expect(isValidCnpj("12.abc.345/01de-35")).toBe(true);
  });
  it.each([
    "",
    "00000000000000",
    "12ABC34501DE36",
    "12ABC34501DEAB",
    "12ABC34501DE35@",
    "1234567800019",
  ])("rejeita CNPJ inválido: %s", (value) => {
    expect(isValidCnpj(value)).toBe(false);
  });
});

const valid = {
  ...ESTABLISHMENT_DEFAULT_VALUES,
  name: "Restaurante da prévia",
  cuisine: "burgers",
  phone: "(11) 98765-4321",
  cnpj: "12.ABC.345/01DE-35",
  openingTime: "18:00",
  closingTime: "02:00",
  postalCode: "90000-000",
  street: "Rua da Prévia",
  number: "S/N",
  district: "Bairro da Prévia",
  city: "Porto Alegre",
  bank: "bb",
  accountType: "checking",
  agency: "1234-5",
  accountNumber: "12345-X",
  holderName: "Titular da Prévia",
  holderDocument: "111.444.777-35",
};

describe("establishmentFormSchema", () => {
  it("permite fechamento após meia-noite e complemento opcional", () => {
    expect(establishmentFormSchema.safeParse(valid).success).toBe(true);
  });
  it("aceita CNPJ do titular e normaliza letras para maiúsculas", () => {
    expect(
      establishmentFormSchema.parse({
        ...valid,
        cnpj: "12.abc.345/01de-35",
        holderDocument: "12.abc.345/01de-35",
      }),
    ).toMatchObject({
      cnpj: "12.ABC.345/01DE-35",
      holderDocument: "12.ABC.345/01DE-35",
    });
  });
  it("exige dia de funcionamento e horários diferentes", () => {
    const result = establishmentFormSchema.safeParse({
      ...valid,
      days: [],
      closingTime: "18:00",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["days", "closingTime"]),
      );
  });
  it.each([
    { postalCode: "123" },
    { phone: "abc" },
    { state: "XX" },
    { bank: "unknown" },
    { accountType: "unknown" },
    { agency: "abc" },
    { accountNumber: "invalid" },
    { holderDocument: "11144477736" },
  ])("rejeita dados inválidos: %o", (changes) => {
    expect(
      establishmentFormSchema.safeParse({ ...valid, ...changes }).success,
    ).toBe(false);
  });
});
