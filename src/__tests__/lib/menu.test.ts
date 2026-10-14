import { describe, expect, it } from "vitest";

import { filterMenuProducts } from "@/lib/menu";
import { menuItemFormSchema } from "@/schemas/menu-item-form";
import { MENU_DEMO_PRODUCTS } from "@/utils/contents/menu";

describe("Cardápio", () => {
  it("combina categoria e busca sem distinguir acentos e maiúsculas", () => {
    const products = filterMenuProducts(
      MENU_DEMO_PRODUCTS,
      "  CALÁBRÉSA  ",
      "pizzas",
    );
    expect(products.map((product) => product.id)).toEqual(["calabresa-irada"]);
    expect(
      filterMenuProducts(MENU_DEMO_PRODUCTS, "Calabresa", "hamburgers"),
    ).toEqual([]);
  });

  it("mantém itens inativos na gestão e retorna vazio para bebidas sem cadastro", () => {
    const products = [{ ...MENU_DEMO_PRODUCTS[0], active: false }];
    expect(filterMenuProducts(products, "", "all")).toHaveLength(1);
    expect(filterMenuProducts(MENU_DEMO_PRODUCTS, "", "drinks")).toEqual([]);
  });

  it.each(["0", "-12", "abc", "12,345", "100000", "1e3"])(
    "rejeita o preço inválido %s",
    (price) => {
      expect(menuItemFormSchema.shape.price.safeParse(price).success).toBe(
        false,
      );
    },
  );

  it.each(["12,90", "12.90", "1"])("aceita o preço válido %s", (price) => {
    expect(menuItemFormSchema.shape.price.safeParse(price).success).toBe(true);
  });
});
