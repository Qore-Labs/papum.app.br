import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  window.localStorage.clear();
  window.history.replaceState({}, "", "/");
  delete window.gtag;
  delete window.dataLayer;
  delete window.clarity;
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Analytics de marketing com consentimento", () => {
  it("atribui a entrada Instagram sem query, campos pessoais ou cookies concedidos", async () => {
    const analytics = await import("@/lib/analytics");
    history.replaceState({}, "", "/instagram?email=privado@example.com");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    analytics.trackMarketingPage("/instagram");
    analytics.trackWaitlistStart();
    analytics.trackLaunchLead();
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "generate_lead",
      expect.objectContaining({
        campaign_source: "instagram",
        campaign_medium: "social",
        page_path: "/instagram",
      }),
    );
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({ analytics_storage: "denied" }),
    );
    expect(JSON.stringify(vi.mocked(window.gtag).mock.calls)).not.toMatch(
      /privado|email=/,
    );
  });
  it("mede uma única intenção do mockup no GA4 e Clarity e interrompe após recusa", async () => {
    const analytics = await import("@/lib/analytics");
    const clarity = await import("@/lib/clarity");
    analytics.setAnalyticsConsent("granted");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    clarity.configureClarity("testproject");
    vi.mocked(window.gtag).mockClear();
    const link = document.createElement("a");
    link.dataset.analyticsCta = "start_now";
    link.dataset.analyticsLocation = "benefits";
    const child = document.createElement("span");
    link.append(child);
    document.body.append(link);
    document.addEventListener("click", analytics.trackMarketingClick);
    try {
      child.click();
      expect(window.gtag).toHaveBeenCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "cta_click",
        expect.objectContaining({
          cta_name: "start_now",
          cta_location: "benefits",
        }),
      );
      expect(window.clarity?.q).toContainEqual([
        "set",
        "cta_location",
        "benefits",
      ]);
      expect(
        window.clarity?.q?.filter((command) => command[0] === "event"),
      ).toEqual([["event", "cta_start_now"]]);
      analytics.setAnalyticsConsent("denied");
      vi.mocked(window.gtag).mockClear();
      child.click();
      expect(window.gtag).not.toHaveBeenCalled();
      expect(clarity.isClarityActive()).toBe(false);
    } finally {
      document.removeEventListener("click", analytics.trackMarketingClick);
      link.remove();
    }
  });
  it("inicia a medição sem conceder cookies e interrompe após desativação", async () => {
    const analytics = await import("@/lib/analytics");
    analytics.configureMarketingAnalytics("G-TEST123");
    analytics.trackMarketingCta("start_now", "final_cta");
    expect(window.gtag).toBeDefined();
    expect(Array.from(window.dataLayer?.at(-2) as IArguments)).toEqual([
      "consent",
      "update",
      expect.objectContaining({
        analytics_storage: "denied",
        ad_storage: "denied",
      }),
    ]);
    analytics.setAnalyticsConsent("denied");
    window.gtag = vi.fn();
    analytics.trackMarketingCta("start_now", "final_cta");
    expect(window.gtag).not.toHaveBeenCalled();
  });
  it("mede cliques e conversão sem e-mail, query ou identificadores do formulário", async () => {
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    window.history.replaceState({}, "", "/?email=privado@example.com");
    analytics.trackMarketingPage("/");
    analytics.trackMarketingCta("plans", "header");
    window.history.replaceState(
      {},
      "",
      "/lancamento?email=privado@example.com",
    );
    analytics.trackLaunchLead();
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "cta_click",
      expect.objectContaining({ cta_name: "plans", cta_location: "header" }),
    );
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "generate_lead",
      expect.objectContaining({ form_name: "launch_waitlist" }),
    );
    expect(JSON.stringify(vi.mocked(window.gtag).mock.calls)).not.toMatch(
      /privado|email=|verificationToken/,
    );
  });
  it("não mede login, painel ou páginas de autenticação", async () => {
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    vi.mocked(window.gtag).mockClear();
    for (const path of ["/login", "/dashboard", "/reset-password"]) {
      window.history.replaceState({}, "", path);
      analytics.trackMarketingPage(path);
      analytics.trackMarketingCta("start_now", "header");
      analytics.trackLaunchLead();
    }
    expect(window.gtag).not.toHaveBeenCalled();
  });
  it("interrompe coleta e remove cookies GA quando a permissão é revogada", async () => {
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    document.cookie = "_ga=test; Path=/";
    analytics.setAnalyticsConsent("denied");
    vi.mocked(window.gtag).mockClear();
    analytics.trackMarketingCta("plans", "header");
    expect(window.gtag).not.toHaveBeenCalled();
    expect(Reflect.get(window, "ga-disable-G-TEST123")).toBe(true);
    expect(document.cookie).not.toContain("_ga=");
  });
  it("lê somente atributos permitidos ao rastrear cliques, inclusive em um filho do link", async () => {
    const analytics = await import("@/lib/analytics");
    analytics.setAnalyticsConsent("granted");
    window.gtag = vi.fn();
    analytics.configureMarketingAnalytics("G-TEST123");
    const link = document.createElement("a");
    link.dataset.analyticsCta = "plans";
    link.dataset.analyticsLocation = "mobile_menu";
    const child = document.createElement("span");
    link.append(child);
    document.body.append(link);
    document.addEventListener("click", analytics.trackMarketingClick);
    child.click();
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "cta_click",
      expect.objectContaining({ cta_location: "mobile_menu" }),
    );
    vi.mocked(window.gtag).mockClear();
    link.dataset.analyticsCta = "pessoa@example.com";
    child.click();
    expect(window.gtag).not.toHaveBeenCalled();
    document.removeEventListener("click", analytics.trackMarketingClick);
    link.remove();
  });
  it("preserva escolha por sessão quando localStorage está bloqueado", async () => {
    const analytics = await import("@/lib/analytics");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    analytics.setAnalyticsConsent("denied");
    expect(analytics.readAnalyticsConsent()).toBe("denied");
  });
});
