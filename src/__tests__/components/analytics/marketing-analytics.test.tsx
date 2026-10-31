import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";
import { configureClarity } from "@/lib/clarity";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/lib/clarity", () => ({
  configureClarity: vi.fn(),
  isClarityActive: () => false,
  isClarityLocationAllowed: () => true,
  isClarityUrlAllowed: () => true,
  stopClarity: () => false,
  revokeClarityConsent: vi.fn(),
}));
vi.mock("next/script", () => ({
  default: ({ src }: { src: string }) => <span role="status">{src}</span>,
}));
beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

function Preferences() {
  return (
    <>
      <button type="button" data-analytics-preferences>
        Preferências de privacidade
      </button>
      <MarketingAnalytics
        measurementId="G-TEST123"
        clarityProjectId="testproject"
      />
    </>
  );
}

describe("Preferências de analytics", () => {
  it("fica desativado quando não existe ID de medição", () => {
    render(<MarketingAnalytics />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("inicia no modo sem cookies sem exibir aviso ou inventar aceite", () => {
    render(<Preferences />);
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(configureClarity).toHaveBeenCalledWith("testproject", "denied");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(localStorage.getItem("papum:analytics-consent:v2")).toBeNull();
  });
  it("permite desativar e reativar pelo rodapé, devolvendo o foco", async () => {
    const user = userEvent.setup();
    render(<Preferences />);
    const trigger = screen.getByRole("button", {
      name: "Preferências de privacidade",
    });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Desativar análise" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(localStorage.getItem("papum:analytics-consent:v2")).toBe("denied");
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(
      screen.getByRole("button", { name: "Permitir cookies de análise" }),
    );
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(configureClarity).toHaveBeenLastCalledWith("testproject", "granted");
  });
  it("respeita recusa anterior sem carregar fornecedores", () => {
    localStorage.setItem("papum:analytics-consent:v2", "denied");
    render(<Preferences />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(configureClarity).not.toHaveBeenCalled();
  });
  it("aguarda a preferência salva durante a hidratação antes de iniciar fornecedores", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Preferences />);
    document.body.append(container);
    localStorage.setItem("papum:analytics-consent:v2", "denied");
    render(<Preferences />, { container, hydrate: true });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(configureClarity).not.toHaveBeenCalled();
  });
  it("um aceite antigo não habilita cookies na nova preferência", () => {
    localStorage.setItem("papum:analytics-consent:v1", "granted");
    render(<Preferences />);
    expect(configureClarity).toHaveBeenCalledWith("testproject", "denied");
  });
  it("fechar o painel não altera a preferência", async () => {
    const user = userEvent.setup();
    render(<Preferences />);
    await user.click(
      screen.getByRole("button", { name: "Preferências de privacidade" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Fechar preferências" }),
    );
    expect(localStorage.getItem("papum:analytics-consent:v2")).toBeNull();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
