import { isMarketingPath, isValidClarityId } from "@/utils/config/analytics";

type ClarityConsent = {
  ad_Storage: "denied";
  analytics_Storage: "granted" | "denied";
};
type ClarityCommand =
  | ["consentv2", ClarityConsent]
  | ["start" | "stop"]
  | ["event", ClarityEvent]
  | ["set", "cta_location" | "error_reason" | "source", string];
export type ClarityEvent =
  | "cta_start_now"
  | "cta_plans"
  | "waitlist_start"
  | "waitlist_submit"
  | "waitlist_success"
  | "waitlist_error";
export type WaitlistErrorReason =
  | "invalid_email"
  | "verification_required"
  | "unavailable"
  | "submission_failed";
interface ClarityClient {
  (...args: ClarityCommand): void;
  q?: ClarityCommand[];
  v?: string;
}
declare global {
  interface Window {
    clarity?: ClarityClient;
  }
}

let requested = false;
let active = false;
let runtimeLoaded = false;
const safeAnchors = new Set([
  "",
  "#proposta",
  "#produto",
  "#como-funciona",
  "#cadastro",
]);

export function isClarityUrlAllowed(url: URL): boolean {
  return (
    url.origin === window.location.origin &&
    isMarketingPath(url.pathname) &&
    !url.search &&
    safeAnchors.has(url.hash)
  );
}

export function isClarityLocationAllowed(): boolean {
  if (
    typeof window === "undefined" ||
    !isClarityUrlAllowed(new URL(window.location.href))
  )
    return false;
  if (!document.referrer) return true;
  try {
    const referrer = new URL(document.referrer);
    // Unlike GA4, the replay runtime reads the actual URL/referrer. Skip ambiguous URLs.
    return !referrer.search && !referrer.hash;
  } catch {
    return false;
  }
}

let storageConsent: "granted" | "denied" | null = null;
export function configureClarity(
  id: string,
  storage: "granted" | "denied" = "denied",
): void {
  if (!isValidClarityId(id) || !isClarityLocationAllowed()) return;
  if (active) {
    if (storageConsent !== storage) {
      window.clarity?.("consentv2", {
        ad_Storage: "denied",
        analytics_Storage: storage,
      });
      storageConsent = storage;
    }
    return;
  }
  const resuming = requested && runtimeLoaded;
  window.clarity ??= Object.assign(
    (...args: ClarityCommand) => {
      window.clarity?.q?.push(args);
    },
    { q: [] as ClarityCommand[] },
  );
  requested = true;
  active = true;
  storageConsent = storage;
  window.clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: storage,
  });
  if (resuming) window.clarity("start");
  if (window.location.pathname === "/instagram")
    window.clarity("set", "source", "instagram");
}

export function revokeClarityConsent(): void {
  if (!requested) return;
  runtimeLoaded ||= Boolean(window.clarity?.v);
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });
  stopClarity();
}

// start/stop and their global dispatch are exposed by Microsoft's clarity-js runtime.
// https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/clarity.ts
export function stopClarity(): boolean {
  if (!requested) return false;
  runtimeLoaded ||= Boolean(window.clarity?.v);
  if (active) {
    active = false;
    window.clarity?.("stop");
    if (!runtimeLoaded && window.clarity) window.clarity.q = [["stop"]];
  }
  // A script in flight cannot reliably be unloaded; reset its document on withdrawal.
  return !runtimeLoaded;
}

export function isClarityActive(): boolean {
  return active;
}

export function trackClarityEvent(event: ClarityEvent): void {
  if (active && isClarityLocationAllowed()) window.clarity?.("event", event);
}

export function tagClarityCtaLocation(location: string): void {
  if (
    active &&
    [
      "header",
      "mobile_menu",
      "hero",
      "benefits",
      "app_preview",
      "final_cta",
      "footer",
    ].includes(location)
  )
    window.clarity?.("set", "cta_location", location);
}

export function trackClarityError(reason: WaitlistErrorReason): void {
  if (!active || !isClarityLocationAllowed()) return;
  window.clarity?.("set", "error_reason", reason);
  trackClarityEvent("waitlist_error");
}
