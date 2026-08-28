import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MobileNavToggle } from "@/components/layout/mobile-nav-toggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/planos", label: "Planos" },
];

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

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Planos" })).toBeInTheDocument();
  });

  it("esconde os links novamente ao clicar no botão de fechar menu", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("button", { name: "Fechar menu" }));

    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });

  it("fecha o menu ao clicar em um link", async () => {
    const user = userEvent.setup();
    render(<MobileNavToggle links={LINKS} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });
});
