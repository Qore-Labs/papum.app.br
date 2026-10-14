import type { MenuFilterId, MenuProduct } from "@/types/menu";

export function filterMenuProducts(
  products: readonly MenuProduct[],
  query: string,
  category: MenuFilterId,
): MenuProduct[] {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  const normalizedQuery = normalize(query);
  return products.filter(
    (product) =>
      (category === "all" || product.category === category) &&
      normalize(product.name).includes(normalizedQuery),
  );
}
