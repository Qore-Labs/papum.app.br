import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
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
    await user.click(
      screen.getByRole("button", { name: "Permitir estatísticas" }),
    );
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
    await user.click(
      screen.getByRole("button", { name: "Permitir estatísticas" }),
    );
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
});
