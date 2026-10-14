import { describe, expect, it } from "vitest";

import { filterCustomers } from "@/lib/customers";
import { customerFormSchema } from "@/schemas/customer-form";
import { CUSTOMER_DEMO_DATA } from "@/utils/contents/customers";

describe("filterCustomers", () => {
  it("busca por nome sem distinguir acentos, e-mail e telefone sem máscara", () => {
    expect(
      filterCustomers(CUSTOMER_DEMO_DATA, "  RICÁRDO  ", "all"),
    ).toHaveLength(2);
    expect(filterCustomers(CUSTOMER_DEMO_DATA, "fmendes@", "all")).toHaveLength(
      1,
    );
    expect(
      filterCustomers(CUSTOMER_DEMO_DATA, "11987654321", "all"),
    ).toHaveLength(7);
  });

  it("combina a busca com pedidos recentes e exclui clientes sem pedidos", () => {
    expect(
      filterCustomers(CUSTOMER_DEMO_DATA, "Mariana", "recent"),
    ).toHaveLength(0);
    expect(
      filterCustomers(
        [
          ...CUSTOMER_DEMO_DATA,
          { ...CUSTOMER_DEMO_DATA[0], id: "new", lastOrderAgeInDays: null },
        ],
        "",
        "recent",
      ),
    ).toHaveLength(5);
  });

  it("ordena os ativos pelo total gasto sem alterar a lista original", () => {
    const originalOrder = CUSTOMER_DEMO_DATA.map((item) => item.id);
    const result = filterCustomers(CUSTOMER_DEMO_DATA, "", "most-active");
    expect(result).toHaveLength(5);
    expect(result.map((item) => item.totalSpent)).toEqual([
      1250.2, 1250.2, 450.2, 450.2, 215,
    ]);
    expect(CUSTOMER_DEMO_DATA.map((item) => item.id)).toEqual(originalOrder);
  });
});

describe("customerFormSchema", () => {
  const valid = {
    name: "Cliente Teste",
    email: "cliente@email.com",
    phone: "(11) 98765-4321",
    status: "active",
  };

  it("normaliza nome e e-mail e aceita telefone com DDD", () => {
    expect(
      customerFormSchema.parse({
        ...valid,
        name: " Cliente Teste ",
        email: " CLIENTE@EMAIL.COM ",
      }),
    ).toMatchObject(valid);
    expect(
      customerFormSchema.safeParse({ ...valid, phone: "1133334444" }).success,
    ).toBe(true);
  });

  it.each(["", "12345678", "abcdefghijk", "119876543210"])(
    "rejeita telefone inválido: %s",
    (phone) => {
      expect(customerFormSchema.safeParse({ ...valid, phone }).success).toBe(
        false,
      );
    },
  );

  it("rejeita nome curto, e-mail inválido e status desconhecido", () => {
    expect(
      customerFormSchema.safeParse({
        ...valid,
        name: "A",
        email: "inválido",
        status: "unknown",
      }).success,
    ).toBe(false);
  });
});
