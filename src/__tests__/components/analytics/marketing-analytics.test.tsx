import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";

import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";
import { Footer } from "@/components/layout/footer";
import { configureClarity } from "@/lib/clarity";

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));
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
  vi.mocked(usePathname).mockReturnValue("/");
});

function Preferences({ configured = true }: { configured?: boolean } = {}) {
  return (
    <>
      <Footer analyticsEnabled />
      <MarketingAnalytics
        hostname={window.location.hostname}
        google={
          configured
            ? {
                tagManagerId: "GTM-TEST123",
                measurementId: "G-TEST123",
              }
            : undefined
        }
        clarityProjectId={configured ? "testproject" : undefined}
      />
    </>
  );
}

describe("Preferências de analytics", () => {
  it("não carrega fornecedores quando não existe ID de medição", () => {
    render(<MarketingAnalytics />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it.each(["/", "/privacidade"])(
    "mantém as preferências acessíveis e salva a escolha em %s sem integrações configuradas",
    async (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      const user = userEvent.setup();
      render(<Preferences configured={false} />);
      const trigger = screen.getByRole("button", {
        name: "Preferências de privacidade",
      });
      await user.click(trigger);
      expect(
        screen.getByRole("region", { name: "Preferências de privacidade" }),
      ).toBeVisible();
      await user.click(
        screen.getByRole("button", { name: "Desativar análise" }),
      );
      expect(localStorage.getItem("papum:analytics-consent:v2")).toBe("denied");
      expect(trigger).toHaveFocus();
      await user.click(trigger);
      await user.click(
        screen.getByRole("button", { name: "Permitir cookies de análise" }),
      );
      expect(localStorage.getItem("papum:analytics-consent:v2")).toBe(
        "granted",
      );
      expect(trigger).toHaveFocus();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(configureClarity).not.toHaveBeenCalled();
    },
  );
  it("inicia no modo sem cookies sem exibir aviso ou inventar aceite", () => {
    render(<Preferences />);
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(
      screen.getByText(
        "https://www.googletagmanager.com/gtm.js?id=GTM-TEST123",
      ),
    ).toBeInTheDocument();
    expect(configureClarity).toHaveBeenCalledWith("testproject", "denied");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(localStorage.getItem("papum:analytics-consent:v2")).toBeNull();
  });
  it.each(["/privacidade", "/login", "/dashboard"])(
    "mantém o GTM fora de %s mesmo com consentimento salvo",
    (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      localStorage.setItem("papum:analytics-consent:v2", "granted");
      render(<Preferences />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    },
  );
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
