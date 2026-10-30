import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";

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
});

describe("Preferências de analytics", () => {
  it("fica desativado quando não existe ID de medição", () => {
    render(<MarketingAnalytics />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("carrega o script apenas após permitir estatísticas", async () => {
    const user = userEvent.setup();
    render(<MarketingAnalytics measurementId="G-TEST123" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Permitir análise" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "googletagmanager.com/gtag/js?id=G-TEST123",
    );
  });
  it("permite recusar e mudar de ideia depois", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button" data-analytics-preferences>
          Preferências de privacidade
        </button>
        <MarketingAnalytics measurementId="G-TEST123" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Recusar" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Preferências de privacidade" }),
    );
    await user.click(screen.getByRole("button", { name: "Permitir análise" }));
    expect(await screen.findByRole("status")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Preferências de privacidade" }),
    );
    await user.click(screen.getByRole("button", { name: "Recusar" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Preferências de privacidade" }),
    ).toHaveFocus();
  });
  it("permite Clarity sem GA4 e não carrega a gravação antes da escolha", async () => {
    const user = userEvent.setup();
    render(<MarketingAnalytics clarityProjectId="testproject" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(/reprodução de sessões/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Permitir análise" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "https://www.clarity.ms/tag/testproject",
    );
  });
  it("não amplia silenciosamente um aceite da versão antiga de consentimento", () => {
    localStorage.setItem("papum:analytics-consent:v1", "granted");
    render(<MarketingAnalytics clarityProjectId="testproject" />);
    expect(screen.getByRole("button", { name: "Recusar" })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
