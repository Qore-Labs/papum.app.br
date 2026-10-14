import type { Customer, CustomerFilterId } from "@/types/customers";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterCustomers(
  customers: readonly Customer[],
  query: string,
  filter: CustomerFilterId,
): Customer[] {
  const search = normalize(query);
  const phoneSearch = search.replace(/\D/g, "");
  const matches = customers.filter((customer) => {
    const matchesQuery =
      normalize(
        `${customer.name} ${customer.email} ${customer.phone}`,
      ).includes(search) ||
      (phoneSearch.length >= 3 &&
        customer.phone.replace(/\D/g, "").includes(phoneSearch));
    if (!matchesQuery) return false;
    if (filter === "recent")
      return (
        customer.lastOrderAgeInDays !== null && customer.lastOrderAgeInDays < 2
      );
    if (filter === "most-active") return customer.status !== "inactive";
    return true;
  });
  return filter === "most-active"
    ? matches.sort((a, b) => b.totalSpent - a.totalSpent)
    : matches;
}
