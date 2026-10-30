import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
  delete window.clarity;
  delete window.gtag;
  delete window.dataLayer;
});
afterEach(() => vi.restoreAllMocks());

describe("Limites da gravação Clarity", () => {
  it("não prepara coleta em rotas privadas, URLs com parâmetros ou ID inválido", async () => {
    const clarity = await import("@/lib/clarity");
    for (const path of [
      "/login",
      "/dashboard",
      "/lancamento?email=privado@example.com",
      "/#token=segredo",
    ]) {
      history.replaceState({}, "", path);
      clarity.configureClarity("testproject");
      expect(window.clarity).toBeUndefined();
    }
    history.replaceState({}, "", "/");
    clarity.configureClarity("invalid/id");
    expect(window.clarity).toBeUndefined();
  });

  it("mede CTAs e cadastro sem GA4, com sinais de anúncios negados e sem campos pessoais", async () => {
    const clarity = await import("@/lib/clarity");
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    clarity.configureClarity("testproject");
    analytics.trackMarketingCta("plans", "header");
    history.replaceState({}, "", "/lancamento");
    analytics.trackWaitlistAttempt();
    analytics.trackWaitlistError("verification_required");
    analytics.trackLaunchLead();
    expect(window.clarity?.q).toContainEqual([
      "consentv2",
      { analytics_Storage: "granted", ad_Storage: "denied" },
    ]);
    expect(window.clarity?.q).toContainEqual(["event", "cta_plans"]);
    expect(window.clarity?.q).toContainEqual(["event", "waitlist_submit"]);
    expect(window.clarity?.q).toContainEqual(["event", "waitlist_success"]);
    expect(window.clarity?.q).toContainEqual([
      "set",
      "error_reason",
      "verification_required",
    ]);
    expect(window.gtag).toBeUndefined();
    expect(JSON.stringify(window.clarity?.q)).not.toMatch(
      /@|verificationToken/,
    );
  });

  it("revoga o consentimento e para o runtime, sem enviar eventos posteriores", async () => {
    const clarity = await import("@/lib/clarity");
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    clarity.configureClarity("testproject");
    const runtime = Object.assign(vi.fn(), { v: "test-runtime" });
    window.clarity = runtime;
    document.cookie = "_clck=test; Path=/";
    document.cookie = "_clsk=test; Path=/";
    analytics.setAnalyticsConsent("denied");
    expect(runtime).toHaveBeenCalledWith("stop");
    expect(runtime).toHaveBeenCalledWith("consentv2", {
      analytics_Storage: "denied",
      ad_Storage: "denied",
    });
    expect(clarity.stopClarity()).toBe(false);
    runtime.mockClear();
    analytics.trackMarketingCta("plans", "header");
    expect(runtime).not.toHaveBeenCalled();
    expect(document.cookie).not.toMatch(/_clck=|_clsk=/);
  });

  it("exige encerrar o documento se o script ainda está a caminho quando a pessoa revoga", async () => {
    const clarity = await import("@/lib/clarity");
    clarity.configureClarity("testproject");
    expect(clarity.stopClarity()).toBe(true);
    expect(clarity.isClarityActive()).toBe(false);
    expect(window.clarity?.q).toEqual([["stop"]]);
  });
});
