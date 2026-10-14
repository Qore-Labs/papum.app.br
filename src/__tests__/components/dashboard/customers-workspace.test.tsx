import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CustomersWorkspace } from "@/components/dashboard/customers-workspace";
import { CUSTOMER_DEMO_DATA } from "@/utils/contents/customers";

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    },
  });
  vi.stubGlobal("requestAnimationFrame", vi.fn());
});

function renderCustomers() {
  return render(
    <CustomersWorkspace
      initialCustomers={CUSTOMER_DEMO_DATA}
      avatars={[]}
      heading={<h1>Base de Clientes</h1>}
      toolbarActions={null}
    />,
  );
}

function customerRows() {
  return within(screen.getByRole("table", { name: "Clientes da prévia" }))
    .getAllByRole("row")
    .slice(1);
}

describe("CustomersWorkspace", () => {
  it("combina busca e filtro e informa a quantidade de resultados", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.click(screen.getByRole("button", { name: "Recentes" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar clientes" }),
      "ricárdo",
    );
    expect(customerRows()).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent(
      "2 clientes encontrados",
    );
    expect(screen.getByRole("button", { name: "Recentes" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("mostra estado vazio e restaura a listagem", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar clientes" }),
      "não existe",
    );
    expect(
      screen.getByRole("heading", { name: "Nenhum cliente encontrado" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(customerRows()).toHaveLength(7);
  });

  it("valida os campos antes de cadastrar", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.click(screen.getByRole("button", { name: "Novo Cliente" }));
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));
    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(customerRows()).toHaveLength(7);
  });

  it("cadastra um cliente sem pedidos e habilita a paginação real", async () => {
    const user = userEvent.setup();
    renderCustomers();
    expect(
      screen.getByRole("button", { name: "Próxima página" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Novo Cliente" }));
    await user.type(screen.getByLabelText("Nome completo"), "Joana Souza");
    await user.type(
      screen.getByLabelText("E-mail", { exact: true }),
      "JOANA@EMAIL.COM",
    );
    await user.type(screen.getByLabelText("Telefone com DDD"), "21999998888");
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));
    await screen.findByText("Mostrando 8–8 de 8 clientes");
    expect(customerRows()).toHaveLength(1);
    const row = customerRows()[0];
    expect(within(row).getByText("joana@email.com")).toBeInTheDocument();
    expect(within(row).getByText("Sem pedidos")).toBeInTheDocument();
    expect(within(row).getByText(/R\$\s*0,00/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(customerRows()).toHaveLength(7);
    await user.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(customerRows()).toHaveLength(1);
  });

  it("edita o cadastro mantendo pedidos, gasto e quantidade de clientes", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.click(
      within(customerRows()[0]).getByRole("button", {
        name: "Editar cliente",
      }),
    );
    expect(screen.getByLabelText("Nome completo")).toHaveValue(
      "Ana Beatriz Silva",
    );
    await user.clear(screen.getByLabelText("Nome completo"));
    await user.type(screen.getByLabelText("Nome completo"), "Ana Silva");
    await user.selectOptions(
      screen.getByLabelText("Status do cliente"),
      "inactive",
    );
    await user.click(screen.getByRole("button", { name: "Salvar cliente" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Ana Silva salvo",
    );
    const row = customerRows()[0];
    expect(within(row).getByText("Ana Silva")).toBeInTheDocument();
    expect(within(row).getByText("Inativo")).toBeInTheDocument();
    expect(within(row).getByText("Hoje, 12:45")).toBeInTheDocument();
    expect(within(row).getByText(/R\$\s*1\.250,20/)).toBeInTheDocument();
    expect(customerRows()).toHaveLength(7);
  });

  it("cancela a edição sem alterar o cadastro", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.click(
      within(customerRows()[0]).getByRole("button", {
        name: "Editar cliente",
      }),
    );
    await user.clear(screen.getByLabelText("Nome completo"));
    await user.type(screen.getByLabelText("Nome completo"), "Descartar");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(
      screen.queryByRole("dialog", { name: "Editar cliente" }),
    ).not.toBeInTheDocument();
    expect(
      within(customerRows()[0]).getByText("Ana Beatriz Silva"),
    ).toBeInTheDocument();
  });

  it("altera o status e remove inativos do filtro Mais Ativos", async () => {
    const user = userEvent.setup();
    renderCustomers();
    await user.click(screen.getByRole("button", { name: "Mais Ativos" }));
    expect(customerRows()).toHaveLength(5);
    await user.click(
      within(customerRows()[0]).getByRole("button", {
        name: "Desativar cliente",
      }),
    );
    expect(customerRows()).toHaveLength(4);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Ana Beatriz Silva desativado",
    );
    await user.click(screen.getByRole("button", { name: "Todos" }));
    expect(customerRows()).toHaveLength(7);
    expect(within(customerRows()[0]).getByText("Inativo")).toBeInTheDocument();
  });
});
