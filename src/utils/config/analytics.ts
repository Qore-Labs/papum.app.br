import { siteConfig } from "@/utils/config/site";

export function isMarketingPath(pathname: string): boolean {
  return (
    pathname === "/" || pathname === "/instagram" || pathname === "/lancamento"
  );
}

export function isValidClarityId(value?: string): value is string {
  return Boolean(value && /^[a-z0-9]{6,20}$/i.test(value));
}

export interface GoogleAnalyticsConfig {
  tagManagerId: string;
  measurementId: string;
}

const googleAnalytics: GoogleAnalyticsConfig = {
  tagManagerId: "GTM-KS26GKCL",
  measurementId: "G-8K7CRHKFQJ",
};

export function getMarketingAnalyticsConfig() {
  const enabled =
    process.env.NODE_ENV === "production" && process.env.PAPUM_E2E !== "1";
  return {
    hostname: new URL(siteConfig.url).hostname,
    google: enabled ? googleAnalytics : undefined,
    clarityProjectId: enabled ? "zaxq92pq94" : undefined,
  };
}
