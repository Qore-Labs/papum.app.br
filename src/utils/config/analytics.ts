export function isMarketingPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/lancamento";
}

export function isValidClarityId(value?: string): value is string {
  return Boolean(value && /^[a-z0-9]{6,20}$/i.test(value));
}

export function getMarketingAnalyticsConfig() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return {
    measurementId: /^G-[A-Z0-9]+$/.test(ga4Id ?? "") ? ga4Id : undefined,
    clarityProjectId:
      process.env.NODE_ENV === "production" &&
      process.env.PAPUM_E2E !== "1" &&
      isValidClarityId(clarityId)
        ? clarityId
        : undefined,
  };
}

export function hasMarketingAnalytics(): boolean {
  const config = getMarketingAnalyticsConfig();
  return Boolean(config.measurementId || config.clarityProjectId);
}
