import { describe, expect, it } from "vitest";

import {
  createDashboardOrdersCsv,
  filterDashboardOrders,
} from "@/lib/dashboard";
import { DASHBOARD_DEMO_ORDERS } from "@/utils/contents/dashboard";

describe("Pedidos do dashboard", () => {
  it("busca por número do pedido", () => {
    expect(
      filterDashboardOrders(DASHBOARD_DEMO_ORDERS, "9280", "24h").map(
        (order) => order.id,
      ),
    ).toEqual(["KD-9280"]);
  });

  it("busca por cliente sem exigir acentos ou a mesma capitalização", () => {
    expect(
      filterDashboardOrders(DASHBOARD_DEMO_ORDERS, "  JOAO  ", "24h").map(
        (order) => order.customer,
      ),
    ).toEqual(["João Diniz"]);
    expect(
      filterDashboardOrders(DASHBOARD_DEMO_ORDERS, "tania", "24h").map(
        (order) => order.customer,
      ),
    ).toEqual(["Tânia M."]);
  });

  it("respeita o período selecionado", () => {
    const history = [{ ...DASHBOARD_DEMO_ORDERS[0], ageInHours: 48 }];
    expect(filterDashboardOrders(history, "", "24h")).toEqual([]);
    expect(filterDashboardOrders(history, "", "7d")).toEqual(history);
  });

  it("exporta apenas os pedidos filtrados com cabeçalhos, status e valores", () => {
    const filtered = filterDashboardOrders(
      DASHBOARD_DEMO_ORDERS,
      "alice",
      "24h",
    );
    const csv = createDashboardOrdersCsv(filtered);
    expect(csv).toContain(
      '"ID do pedido";"Cliente";"Status";"Valor (R$)";"Hora"',
    );
    expect(csv).toContain(
      '"#KD-9281";"Alice Silva";"EM TRANSITO";"142,50";"12:45 PM"',
    );
    expect(csv).not.toContain("João Diniz");
  });

  it("escapa aspas no conteúdo do CSV", () => {
    expect(
      createDashboardOrdersCsv([
        { ...DASHBOARD_DEMO_ORDERS[0], customer: 'Cliente "Centro"' },
      ]),
    ).toContain('"Cliente ""Centro"""');
  });
});
