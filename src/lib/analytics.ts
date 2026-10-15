export type AnalyticsConsent = "granted" | "denied" | null;
export type MarketingCta = "start_now" | "plans";
export type MarketingLocation =
  "header" | "mobile_menu" | "hero" | "benefits" | "final_cta" | "footer";

type GtagCommand =
  | ["js", Date]
  | ["config", string, Record<string, unknown>]
  | ["consent", "default" | "update", Record<string, string>]
  | ["event", string, Record<string, string>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagCommand) => void;
  }
}

const consentKey = "papum:analytics-consent:v1";
const consentEvent = "papum:analytics-consent";
let sessionConsent: AnalyticsConsent = null;
let sessionOnly = false;
let configuredId: string | null = null;
const deniedAdvertising = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export function isMarketingPath(pathname: string): boolean {
  return ["/", "/lancamento", "/planos"].includes(pathname);
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  if (sessionOnly) return sessionConsent;
  try {
    const stored = window.localStorage.getItem(consentKey);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return sessionConsent;
  }
}

export function subscribeAnalyticsConsent(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(consentEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(consentEvent, onChange);
  };
}

function setDisabled(id: string, value: boolean): void {
  Reflect.set(window, `ga-disable-${id}`, value);
}

function clearAnalyticsCookies(): void {
  const domains = window.location.hostname.split(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (let i = 0; i < domains.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domains.slice(i).join(".")}; SameSite=Lax`;
    }
  }
}

export function setAnalyticsConsent(
  value: Exclude<AnalyticsConsent, null>,
): void {
  sessionConsent = value;
  try {
    window.localStorage.setItem(consentKey, value);
    sessionOnly = false;
  } catch {
    /* Session-only choice when storage is unavailable. */
    sessionOnly = true;
  }
  if (value === "denied") {
    if (configuredId) setDisabled(configuredId, true);
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ...deniedAdvertising,
    });
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new Event(consentEvent));
}

export function configureMarketingAnalytics(id: string): void {
  if (!/^G-[A-Z0-9]+$/.test(id) || readAnalyticsConsent() !== "granted") return;
  setDisabled(id, false);
  window.dataLayer ??= [];
  window.gtag ??= function () {
    // gtag's queue expects Arguments objects, as in Google's official snippet.
    // eslint-disable-next-line prefer-rest-params -- Keep Google's documented queue protocol.
    window.dataLayer?.push(arguments);
  };
  if (configuredId !== id) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ...deniedAdvertising,
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_referrer: "",
    });
    configuredId = id;
  }
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ...deniedAdvertising,
  });
}

export function pauseMarketingAnalytics(): void {
  if (typeof window !== "undefined" && configuredId)
    setDisabled(configuredId, true);
}

export function trackMarketingPage(pathname: string): void {
  if (
    !configuredId ||
    readAnalyticsConsent() !== "granted" ||
    !isMarketingPath(pathname)
  )
    return;
  window.gtag?.("event", "page_view", {
    page_path: pathname,
    page_location: `${window.location.origin}${pathname}`,
    page_title:
      pathname === "/lancamento"
        ? "Lançamento Pápum Delivery"
        : "Pápum Delivery",
    page_referrer: "",
  });
}

export function trackMarketingCta(
  cta: MarketingCta,
  location: MarketingLocation,
): void {
  if (
    !configuredId ||
    readAnalyticsConsent() !== "granted" ||
    !isMarketingPath(window.location.pathname)
  )
    return;
  window.gtag?.("event", "cta_click", {
    cta_name: cta,
    cta_location: location,
    page_path: window.location.pathname,
    page_location: `${window.location.origin}${window.location.pathname}`,
    page_referrer: "",
  });
}

export function trackLaunchLead(): void {
  if (
    !configuredId ||
    readAnalyticsConsent() !== "granted" ||
    window.location.pathname !== "/lancamento"
  )
    return;
  window.gtag?.("event", "generate_lead", {
    form_name: "launch_waitlist",
    page_path: "/lancamento",
    page_location: `${window.location.origin}/lancamento`,
    page_referrer: "",
  });
}

export function trackMarketingClick(event: MouseEvent): void {
  const element =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-analytics-cta]")
      : null;
  const cta = element?.dataset.analyticsCta;
  const location = element?.dataset.analyticsLocation;
  if (
    (cta !== "start_now" && cta !== "plans") ||
    !location ||
    ![
      "header",
      "mobile_menu",
      "hero",
      "benefits",
      "final_cta",
      "footer",
    ].includes(location)
  )
    return;
  trackMarketingCta(cta, location as MarketingLocation);
}
