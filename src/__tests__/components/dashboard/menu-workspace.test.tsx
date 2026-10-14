import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MenuWorkspace } from "@/components/dashboard/menu-workspace";
import { MENU_DEMO_PRODUCTS, MENU_PHOTOS } from "@/utils/contents/menu";

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

function renderMenu() {
  return render(
    <MenuWorkspace
      initialProducts={MENU_DEMO_PRODUCTS}
      photos={MENU_PHOTOS.map((photo) => ({
        id: photo.id,
        label: photo.label,
        image: <span>Foto de {photo.label}</span>,
      }))}
      heading={<h1>Gestão de Cardápio</h1>}
      toolbarActions={null}
    />,
  );
}

describe("MenuWorkspace", () => {
  it("combina busca e categoria e anuncia o resultado", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Pizzas" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar pratos" }),
      "Calábrésa",
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("article", { name: "Calabresa Irada" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 item encontrado");
  });

  it("mostra bebidas sem cadastro e restaura todos os produtos", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Bebidas" }));
    expect(
      screen.getByRole("heading", { name: "Nenhuma bebida cadastrada" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("altera disponibilidade sem remover o item da gestão", async () => {
    const user = userEvent.setup();
    renderMenu();
    const card = screen.getByRole("article", { name: "Classic Burger" });
    const toggle = within(card).getByRole("switch");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(within(card).getByText("Inativo")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Classic Burger desativado nesta prévia",
    );
  });

  it("valida o formulário vazio sem incluir um produto", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Novo Item" }));
    await user.click(screen.getByRole("button", { name: "Salvar item" }));
    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(screen.getAllByRole("article")).toHaveLength(9);
    expect(
      screen.getByRole("dialog", { name: "Novo item" }),
    ).toBeInTheDocument();
  });

  it("cria uma bebida com preço decimal e placeholder sem imagem", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Novo Item" }));
    await user.type(
      screen.getByRole("textbox", { name: "Nome do produto" }),
      "Suco de laranja",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Descrição" }),
      "Suco natural, 300 ml.",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Preço (R$)" }),
      "12,90",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria" }),
      "drinks",
    );
    await user.click(screen.getByRole("button", { name: "Salvar item" }));
    const card = await screen.findByRole("article", {
      name: "Suco de laranja",
    });
    expect(within(card).getByText(/R\$\s*12,90/)).toBeInTheDocument();
    expect(within(card).getByText("Sem imagem")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("edita nome, categoria e preço mantendo um único produto", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(
      screen.getByRole("button", { name: "Editar Classic Burger" }),
    );
    const name = screen.getByRole("textbox", { name: "Nome do produto" });
    const price = screen.getByRole("textbox", { name: "Preço (R$)" });
    expect(name).toHaveValue("Classic Burger");
    await user.clear(name);
    await user.type(name, "Pizza da casa");
    await user.clear(price);
    await user.type(price, "55.50");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria" }),
      "pizzas",
    );
    await user.click(screen.getByRole("button", { name: "Salvar item" }));
    expect(
      within(
        await screen.findByRole("article", { name: "Pizza da casa" }),
      ).getByText(/R\$\s*55,50/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("article", { name: "Classic Burger" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("descarta a edição ao cancelar", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(
      screen.getByRole("button", { name: "Editar Classic Burger" }),
    );
    await user.clear(screen.getByRole("textbox", { name: "Nome do produto" }));
    await user.type(
      screen.getByRole("textbox", { name: "Nome do produto" }),
      "Nome descartado",
    );
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(
      screen.getByRole("article", { name: "Classic Burger" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
