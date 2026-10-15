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
    window.turnstile = { render: renderWidget, remove };
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
    window.turnstile = { render: renderWidget, remove: vi.fn() };
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
      "Não foi possível carregar a verificação",
    );
    act(() => options.callback("new-token"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
