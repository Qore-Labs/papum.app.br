import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renderiza o texto recebido via children", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("chama onClick ao ser clicado", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Salvar</Button>);
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fica desabilitado quando a prop disabled é passada", () => {
    render(<Button disabled>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
