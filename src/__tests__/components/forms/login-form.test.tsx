import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/forms/login-form";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeEach(() => push.mockClear());

describe("LoginForm", () => {
  it("associa os erros aos campos e foca o primeiro campo inválido", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /^Entrar$/ }));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(push).not.toHaveBeenCalled();
    const identifier = screen.getByRole("textbox", {
      name: "Email ou Telefone",
    });
    expect(identifier).toHaveFocus();
    expect(identifier).toHaveAttribute("aria-invalid", "true");
    expect(identifier).toHaveAccessibleDescription(
      "Informe seu email ou telefone",
    );
    expect(
      screen.getByLabelText("Senha", { exact: true }),
    ).toHaveAccessibleDescription("A senha deve ter pelo menos 6 caracteres");
  });

  it("mantém a validação de tamanho mínimo da senha", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Email ou Telefone" }),
      "cliente@example.com",
    );
    await user.type(screen.getByLabelText("Senha", { exact: true }), "123");
    await user.click(screen.getByRole("button", { name: /^Entrar$/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A senha deve ter pelo menos 6 caracteres",
    );
    expect(screen.getByLabelText("Senha", { exact: true })).toHaveFocus();
  });

  it("mostra e oculta a senha sem apagar o valor digitado", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const password = screen.getByLabelText("Senha", { exact: true });

    await user.type(password, "senha-de-teste");
    expect(password).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Mostrar senha" }),
    ).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(password).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Ocultar senha" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveValue("senha-de-teste");
  });

  it("abre a prévia do dashboard após validar os campos, sem registrar credenciais", async () => {
    const user = userEvent.setup();
    const consoleLog = vi
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    try {
      render(<LoginForm />);
      const identifier = screen.getByRole("textbox", {
        name: "Email ou Telefone",
      });
      const password = screen.getByLabelText("Senha", { exact: true });

      await user.type(identifier, "cliente@example.com");
      await user.type(password, "senha-de-teste");
      await user.click(screen.getByRole("button", { name: /^Entrar$/ }));

      await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
      expect(identifier).toHaveValue("cliente@example.com");
      expect(password).toHaveValue("senha-de-teste");
      expect(consoleLog).not.toHaveBeenCalled();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    } finally {
      consoleLog.mockRestore();
    }
  });
});
