import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
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
});

describe("AdminMobileNav", () => {
  it("abre o menu com estado ARIA adequado e fecha pelo botão", async () => {
    const user = userEvent.setup();
    render(
      <AdminMobileNav>
        <a href="#orders">Pedidos</a>
      </AdminMobileNav>,
    );
    const trigger = screen.getByRole("button", {
      name: "Abrir menu do painel",
    });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("dialog", { name: "Menu do painel" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Menu do painel" }).id).toBe(
      trigger.getAttribute("aria-controls"),
    );

    await user.click(
      screen.getByRole("button", { name: "Fechar menu do painel" }),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("dialog", { name: "Menu do painel" }),
    ).not.toBeInTheDocument();
  });

  it("fecha ao selecionar um destino da navegação", async () => {
    const user = userEvent.setup();
    render(
      <AdminMobileNav>
        <a href="#orders">Pedidos</a>
      </AdminMobileNav>,
    );
    await user.click(
      screen.getByRole("button", { name: "Abrir menu do painel" }),
    );
    await user.click(screen.getByRole("link", { name: "Pedidos" }));
    expect(
      screen.queryByRole("dialog", { name: "Menu do painel" }),
    ).not.toBeInTheDocument();
  });

  it("fecha o diálogo ao desmontar o componente", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <AdminMobileNav>
        <a href="#orders">Pedidos</a>
      </AdminMobileNav>,
    );
    await user.click(
      screen.getByRole("button", { name: "Abrir menu do painel" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Menu do painel" });
    unmount();
    expect(dialog).not.toHaveAttribute("open");
  });
});
