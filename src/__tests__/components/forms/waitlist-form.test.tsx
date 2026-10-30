import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  WaitlistForm,
  type WaitlistSubmissionResult,
} from "@/components/forms/waitlist-form";
import { trackLaunchLead } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  trackLaunchLead: vi.fn(),
  trackWaitlistAttempt: vi.fn(),
  trackWaitlistError: vi.fn(),
}));
beforeEach(() => {
  vi.clearAllMocks();
});

describe("WaitlistForm", () => {
  it("pede o e-mail e leva o foco ao campo quando está vazio", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Informe seu e-mail.",
    );
    expect(screen.getByRole("textbox", { name: "Seu e-mail" })).toHaveFocus();
  });

  it("não envia um e-mail inválido", async () => {
    const user = userEvent.setup();
    const subscribeAction = vi.fn();
    render(<WaitlistForm subscribeAction={subscribeAction} />);

    await user.type(
      screen.getByRole("textbox", { name: "Seu e-mail" }),
      "invalido",
    );
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Informe um e-mail válido.",
    );
    expect(subscribeAction).not.toHaveBeenCalled();
    expect(trackLaunchLead).not.toHaveBeenCalled();
  });

  it("não confirma um cadastro enquanto a integração não está conectada", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    const email = screen.getByRole("textbox", { name: "Seu e-mail" });
    await user.type(email, "cliente@restaurante.com");
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível concluir o cadastro agora.",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(email).toHaveValue("cliente@restaurante.com");
  });

  it("envia o e-mail normalizado e confirma apenas após a integração responder", async () => {
    const user = userEvent.setup();
    const subscribeAction = vi.fn().mockResolvedValue({
      status: "success",
      message: "Você será avisado quando o Pápum! Delivery lançar.",
    });
    render(<WaitlistForm subscribeAction={subscribeAction} />);

    const email = screen.getByRole("textbox", { name: "Seu e-mail" });
    await user.type(email, "Cliente@Restaurante.COM");
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(subscribeAction).toHaveBeenCalledWith({
      email: "cliente@restaurante.com",
      verificationToken: "",
      website: "",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Você será avisado",
    );
    expect(email).toHaveValue("");
    expect(trackLaunchLead).toHaveBeenCalledOnce();
  });

  it("preserva o e-mail quando o envio falha", async () => {
    const user = userEvent.setup();
    const subscribeAction = vi
      .fn()
      .mockRejectedValue(new Error("Indisponível"));
    render(<WaitlistForm subscribeAction={subscribeAction} />);

    const email = screen.getByRole("textbox", { name: "Seu e-mail" });
    await user.type(email, "cliente@restaurante.com");
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tente novamente em breve.",
    );
    expect(email).toHaveValue("cliente@restaurante.com");
    expect(trackLaunchLead).not.toHaveBeenCalled();
  });

  it("impede um novo envio enquanto aguarda a resposta", async () => {
    const user = userEvent.setup();
    let finishSubmission:
      ((result: WaitlistSubmissionResult) => void) | undefined;
    const pendingSubmission = new Promise<WaitlistSubmissionResult>(
      (resolve) => {
        finishSubmission = resolve;
      },
    );
    const subscribeAction = vi.fn(() => pendingSubmission);
    render(<WaitlistForm subscribeAction={subscribeAction} />);

    await user.type(
      screen.getByRole("textbox", { name: "Seu e-mail" }),
      "cliente@restaurante.com",
    );
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));

    expect(
      await screen.findByRole("button", { name: "Enviando..." }),
    ).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Seu e-mail" })).toBeDisabled();

    await act(async () => {
      finishSubmission?.({
        status: "success",
        message: "Cadastro confirmado.",
      });
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Quero ser avisado" }),
      ).toBeEnabled();
    });
    expect(subscribeAction).toHaveBeenCalledTimes(1);
  });

  it("pede verificação sem enviar ou contar conversão enquanto não houver token", async () => {
    const user = userEvent.setup();
    const subscribeAction = vi.fn();
    render(
      <WaitlistForm
        subscribeAction={subscribeAction}
        turnstileSiteKey="test-site-key"
      />,
    );
    await user.type(
      screen.getByRole("textbox", { name: "Seu e-mail" }),
      "cliente@exemplo.com",
    );
    await user.click(screen.getByRole("button", { name: "Quero ser avisado" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Conclua a verificação",
    );
    expect(subscribeAction).not.toHaveBeenCalled();
    expect(trackLaunchLead).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Seu e-mail" })).toHaveValue(
      "cliente@exemplo.com",
    );
  });
});
