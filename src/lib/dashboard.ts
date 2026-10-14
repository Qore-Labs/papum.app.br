import type {
  DashboardPeriodId,
  DashboardReportOrder,
} from "@/types/dashboard";
import {
  DASHBOARD_ORDER_STATUSES,
  DASHBOARD_PERIODS,
} from "@/utils/contents/dashboard";

export function filterDashboardOrders<T extends DashboardReportOrder>(
  orders: readonly T[],
  query: string,
  period: DashboardPeriodId,
): T[] {
  const normalizedQuery = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
  const maxHours =
    DASHBOARD_PERIODS.find((item) => item.id === period)?.hours ?? 24;
  return orders.filter((order) => {
    const text = `${order.id} ${order.customer}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
    return order.ageInHours <= maxHours && text.includes(normalizedQuery);
  });
}

export function createDashboardOrdersCsv(
  orders: readonly DashboardReportOrder[],
): string {
  const rows = [
    ["ID do pedido", "Cliente", "Status", "Valor (R$)", "Hora"],
    ...orders.map((order) => [
      `#${order.id}`,
      order.customer,
      DASHBOARD_ORDER_STATUSES[order.status].label,
      order.amount.toFixed(2).replace(".", ","),
      order.time,
    ]),
  ];
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(";"),
      )
      .join("\r\n")
  );
}
