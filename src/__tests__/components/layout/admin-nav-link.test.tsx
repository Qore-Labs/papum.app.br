import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminNavLink } from "@/components/layout/admin-nav-link";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname }));

describe("AdminNavLink", () => {
  it.each([
    ["/dashboard", "Pedidos", "Cardápio"],
    ["/dashboard/cardapio", "Cardápio", "Pedidos"],
  ])("indica somente a aba atual em %s", (pathname, active, inactive) => {
    usePathname.mockReturnValue(pathname);
    render(
      <nav>
        <AdminNavLink href="/dashboard">Pedidos</AdminNavLink>
        <AdminNavLink href="/dashboard/cardapio">Cardápio</AdminNavLink>
      </nav>,
    );
    expect(screen.getByRole("link", { name: active })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: inactive })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
