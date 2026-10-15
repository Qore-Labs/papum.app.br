import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { MobileNavToggle } from "@/components/layout/mobile-nav-toggle";
import type { NavLink } from "@/utils/config/site";

const LINKS = [
  { href: "/", label: "Home" },
  {
    href: "/lancamento",
    label: "Planos",
    openInNewTab: true,
    analyticsCta: "plans",
  },
] satisfies NavLink[];

const originalShowModal = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  "showModal",
);
const originalClose = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  "close",
);

beforeAll(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      media: query,
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );

  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
  for (const [name, descriptor] of [
    ["showModal", originalShowModal],
    ["close", originalClose],
  ] as const) {
    if (descriptor) {
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    } else {
      Reflect.deleteProperty(HTMLDialogElement.prototype, name);
    }
  }
});

describe("MobileNavToggle", () => {
  it("não exibe os links de navegação antes de abrir o menu", () => {
    render(<MobileNavToggle links={LINKS} />);

    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });

  it("exibe os links de navegação ao clicar no botão de abrir menu", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Planos" })).toBeInTheDocument();
  });

  it("esconde os links novamente ao clicar no botão de fechar menu", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("button", { name: "Fechar menu" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: "Home" }),
      ).not.toBeInTheDocument();
    });
  });

  it("fecha o menu ao clicar em um link", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("link", { name: "Home" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: "Home" }),
      ).not.toBeInTheDocument();
    });
  });

  it("encaminha planos e começar agora ao lançamento em uma nova aba", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    for (const name of ["Planos", "Começar agora"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", "/lancamento");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
