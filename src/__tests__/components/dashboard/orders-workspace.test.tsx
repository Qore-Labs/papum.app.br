import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { OrdersWorkspace } from "@/components/dashboard/orders-workspace";
import { DASHBOARD_DEMO_ORDERS } from "@/utils/contents/dashboard";

function renderWorkspace() {
  return render(
    <OrdersWorkspace
      toolbarActions={null}
      heading={<h1>Visão Geral</h1>}
      orders={DASHBOARD_DEMO_ORDERS.map((order) => ({
        ...order,
        tableRow: (
          <tr key={order.id}>
            <td colSpan={5}>
              {order.id} — {order.customer}
            </td>
          </tr>
        ),
        mobileCard: (
          <li key={order.id}>
            {order.id} — {order.customer}
          </li>
        ),
      }))}
    />,
  );
}

describe("OrdersWorkspace", () => {
  it("atualiza os pedidos exibidos ao buscar por cliente", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar pedidos, clientes" }),
      "joao",
    );

    const table = screen.getByRole("table", { name: "Pedidos recentes" });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(within(table).getByText(/João Diniz/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 pedido encontrado");
  });

  it("mostra o estado vazio e impede exportar uma busca sem resultados", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await user.type(screen.getByRole("searchbox"), "cliente inexistente");

    const table = screen.getByRole("table", { name: "Pedidos recentes" });
    expect(
      within(table).getByText(/Nenhum pedido encontrado/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Exportar Relatório" }),
    ).toBeDisabled();
  });

  it("limpa a busca e restaura o período ao ver todos os pedidos", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await user.type(screen.getByRole("searchbox"), "Alice");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Período dos pedidos" }),
      "7d",
    );
    await user.click(
      screen.getByRole("button", { name: "Ver Todos os Pedidos" }),
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("24h");
    expect(screen.getByRole("status")).toHaveTextContent(
      "4 pedidos encontrados",
    );
  });
});
