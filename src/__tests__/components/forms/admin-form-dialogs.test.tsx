import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CustomerForm } from "@/components/forms/customer-form";
import { MenuItemForm } from "@/components/forms/menu-item-form";
import { CUSTOMER_DEMO_DATA } from "@/utils/contents/customers";
import { MENU_DEMO_PRODUCTS } from "@/utils/contents/menu";

const cases = [
  { kind: "item", editing: false, title: "Novo item" },
  { kind: "item", editing: true, title: "Editar item" },
  { kind: "customer", editing: false, title: "Novo cliente" },
  { kind: "customer", editing: true, title: "Editar cliente" },
] as const;

beforeEach(() => {
  // jsdom has no native dialog API. Match the browser's asynchronous close
  // event so StrictMode's setup/cleanup/setup cycle exercises the regression.
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute("open");
      window.setTimeout(() => this.dispatchEvent(new Event("close")), 0);
    },
  });
});

describe("Formulários do admin em StrictMode", () => {
  it.each(cases)(
    "mantém $title aberto para preenchimento e permite cancelar",
    async ({ kind, editing, title }) => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();
      render(
        <StrictMode>
          {kind === "item" ? (
            <MenuItemForm
              product={editing ? MENU_DEMO_PRODUCTS[0] : null}
              onClose={onClose}
              onSave={onSave}
            />
          ) : (
            <CustomerForm
              customer={editing ? CUSTOMER_DEMO_DATA[0] : null}
              onClose={onClose}
              onSave={onSave}
            />
          )}
        </StrictMode>,
      );
      const dialog = screen.getByRole("dialog", { name: title });
      const name = screen.getByRole("textbox", {
        name: kind === "item" ? "Nome do produto" : "Nome completo",
      });
      await user.clear(name);
      await user.type(name, "Cadastro de teste");
      expect(name).toHaveValue("Cadastro de teste");
      expect(dialog).toHaveAttribute("open");
      expect(onClose).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: "Cancelar" }));
      await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
      expect(dialog).not.toHaveAttribute("open");
    },
  );
});
