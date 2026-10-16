import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TurnstileVerification } from "@/components/forms/turnstile-verification";

vi.mock("next/script", () => ({
  default: ({ onReady }: { onReady: () => void }) => (
    <button type="button" onClick={onReady}>
      Script carregado
    </button>
  ),
}));
afterEach(() => {
  delete window.turnstile;
});

describe("Verificação de segurança", () => {
  it("recebe token, trata expiração e remove widget ao desmontar", async () => {
    const user = userEvent.setup();
    const renderWidget = vi
      .fn<NonNullable<Window["turnstile"]>["render"]>()
      .mockReturnValue("widget-id");
    const remove = vi.fn();
    window.turnstile = { render: renderWidget, remove, reset: vi.fn() };
    const onToken = vi.fn();
    const onInvalid = vi.fn();
    const view = render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={onToken}
        onInvalid={onInvalid}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    const options = renderWidget.mock.calls[0][1];
    expect(options).toMatchObject({
      sitekey: "public-key",
      action: "launch_waitlist",
      size: "flexible",
    });
    act(() => options.callback("one-use-token"));
    expect(onToken).toHaveBeenCalledWith("one-use-token");
    act(() => options["expired-callback"]());
    expect(onInvalid).toHaveBeenCalledOnce();
    view.unmount();
    expect(remove).toHaveBeenCalledWith("widget-id");
  });
  it("mostra erro recuperável e o limpa quando uma nova verificação tem sucesso", async () => {
    const user = userEvent.setup();
    const renderWidget = vi
      .fn<NonNullable<Window["turnstile"]>["render"]>()
      .mockReturnValue("widget-id");
    window.turnstile = {
      render: renderWidget,
      remove: vi.fn(),
      reset: vi.fn(),
    };
    render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={vi.fn()}
        onInvalid={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    const options = renderWidget.mock.calls[0][1];
    act(() => options["error-callback"]());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível conectar à verificação",
    );
    act(() => options.callback("new-token"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("permite repetir o desafio sem recarregar a página", async () => {
    const user = userEvent.setup();
    const renderWidget = vi
      .fn<NonNullable<Window["turnstile"]>["render"]>()
      .mockReturnValue("widget-id");
    const reset = vi.fn();
    window.turnstile = { render: renderWidget, remove: vi.fn(), reset };
    const onInvalid = vi.fn();
    render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={vi.fn()}
        onInvalid={onInvalid}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    act(() => renderWidget.mock.calls[0][1]["error-callback"]("200500"));
    expect(screen.getByText("Referência: 200500")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Tentar verificação novamente" }),
    );
    expect(reset).toHaveBeenCalledWith("widget-id");
    expect(onInvalid).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("identifica domínio não autorizado sem oferecer uma repetição que não resolve a configuração", async () => {
    const user = userEvent.setup();
    const renderWidget = vi
      .fn<NonNullable<Window["turnstile"]>["render"]>()
      .mockReturnValue("widget-id");
    window.turnstile = {
      render: renderWidget,
      remove: vi.fn(),
      reset: vi.fn(),
    };
    render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={vi.fn()}
        onInvalid={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    act(() => renderWidget.mock.calls[0][1]["error-callback"]("110200"));
    expect(screen.getByRole("alert")).toHaveTextContent("neste endereço");
    expect(screen.getByText("Referência: 110200")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Tentar verificação novamente" }),
    ).not.toBeInTheDocument();
  });

  it("ignora callbacks atrasados de um widget já removido", async () => {
    const user = userEvent.setup();
    const renderWidget = vi
      .fn<NonNullable<Window["turnstile"]>["render"]>()
      .mockReturnValue("widget-id");
    window.turnstile = {
      render: renderWidget,
      remove: vi.fn(),
      reset: vi.fn(),
    };
    const onToken = vi.fn();
    const onInvalid = vi.fn();
    const view = render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={onToken}
        onInvalid={onInvalid}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    const options = renderWidget.mock.calls[0][1];
    view.unmount();
    act(() => {
      options.callback("stale-token");
      options["expired-callback"]();
      options["error-callback"]("200500");
    });
    expect(onToken).not.toHaveBeenCalled();
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it("trata uma rejeição de inicialização do SDK sem derrubar o formulário", async () => {
    const user = userEvent.setup();
    window.turnstile = {
      render: vi.fn(() => {
        throw new Error("invalid configuration");
      }),
      remove: vi.fn(),
      reset: vi.fn(),
    };
    render(
      <TurnstileVerification
        siteKey="public-key"
        onToken={vi.fn()}
        onInvalid={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Script carregado" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível conectar",
    );
  });
});
