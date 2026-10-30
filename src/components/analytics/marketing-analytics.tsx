"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  configureClarity,
  isClarityActive,
  isClarityLocationAllowed,
  isClarityUrlAllowed,
  stopClarity,
} from "@/lib/clarity";
import { isValidClarityId } from "@/utils/config/analytics";

import {
  configureMarketingAnalytics,
  isMarketingPath,
  pauseMarketingAnalytics,
  readAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  trackMarketingClick,
  trackMarketingPage,
} from "@/lib/analytics";

interface MarketingAnalyticsProps {
  measurementId?: string;
  clarityProjectId?: string;
}
const serverConsent = () => null;

export function MarketingAnalytics({
  measurementId,
  clarityProjectId,
}: MarketingAnalyticsProps) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    serverConsent,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const previousPage = useRef<string | null>(null);
  const preferencesTrigger = useRef<HTMLElement | null>(null);
  const gaEnabled = Boolean(
    measurementId && /^G-[A-Z0-9]+$/.test(measurementId),
  );
  const clarityEnabled = isValidClarityId(clarityProjectId);
  const enabled = gaEnabled || clarityEnabled;
  const marketingPage = isMarketingPath(pathname);
  const clarityAllowed =
    clarityEnabled &&
    consent === "granted" &&
    marketingPage &&
    isClarityLocationAllowed();

  useLayoutEffect(() => {
    if (clarityAllowed && clarityProjectId) configureClarity(clarityProjectId);
    else if (stopClarity()) window.location.reload();
  }, [clarityAllowed, clarityProjectId, pathname, consent]);

  useEffect(() => {
    if (!clarityEnabled) return;
    function guardNavigation(event: MouseEvent) {
      if (
        !isClarityActive() ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || isClarityUrlAllowed(url))
        return;
      event.preventDefault();
      event.stopPropagation();
      stopClarity();
      // Crossing the recording boundary gets a fresh document, before private DOM exists.
      window.location.assign(url.href);
    }
    function guardHistory() {
      if (!isClarityLocationAllowed() && stopClarity())
        window.location.reload();
    }
    function resumeDocument(event: PageTransitionEvent) {
      if (
        !event.persisted ||
        !clarityProjectId ||
        readAnalyticsConsent() !== "granted" ||
        !isClarityLocationAllowed()
      )
        return;
      if (stopClarity()) window.location.reload();
      else configureClarity(clarityProjectId);
    }
    document.addEventListener("click", guardNavigation, true);
    window.addEventListener("popstate", guardHistory, true);
    window.addEventListener("hashchange", guardHistory, true);
    window.addEventListener("pageshow", resumeDocument);
    return () => {
      document.removeEventListener("click", guardNavigation, true);
      window.removeEventListener("popstate", guardHistory, true);
      window.removeEventListener("hashchange", guardHistory, true);
      window.removeEventListener("pageshow", resumeDocument);
    };
  }, [clarityEnabled, clarityProjectId]);

  useEffect(() => {
    if (!enabled || !marketingPage) return;
    function openPreferences(event: MouseEvent) {
      const trigger =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-analytics-preferences]")
          : null;
      if (!trigger) return;
      preferencesTrigger.current = trigger;
      setPreferencesOpen(true);
    }
    document.addEventListener("click", openPreferences);
    return () => document.removeEventListener("click", openPreferences);
  }, [enabled, marketingPage]);

  useEffect(() => {
    if (
      !gaEnabled ||
      !measurementId ||
      consent !== "granted" ||
      !marketingPage
    ) {
      pauseMarketingAnalytics();
      previousPage.current = null;
      return;
    }
    configureMarketingAnalytics(measurementId);
    if (previousPage.current !== pathname) {
      trackMarketingPage(pathname);
      previousPage.current = pathname;
    }
    return () => {
      pauseMarketingAnalytics();
    };
  }, [consent, gaEnabled, marketingPage, measurementId, pathname]);

  useEffect(() => {
    if (!enabled || consent !== "granted" || !marketingPage) return;
    document.addEventListener("click", trackMarketingClick, true);
    return () =>
      document.removeEventListener("click", trackMarketingClick, true);
  }, [consent, enabled, marketingPage]);

  if (!enabled || !marketingPage) return null;
  function choose(value: "granted" | "denied") {
    setAnalyticsConsent(value);
    setPreferencesOpen(false);
    preferencesTrigger.current?.focus();
  }

  return (
    <>
      {consent === "granted" && gaEnabled && (
        <Script
          id="papum-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
        />
      )}
      {clarityAllowed && (
        <Script
          id="papum-clarity"
          src={`https://www.clarity.ms/tag/${clarityProjectId}`}
          strategy="afterInteractive"
        />
      )}
      {consent === null || preferencesOpen ? (
        <section
          id="analytics-preferences"
          aria-label="Preferências de privacidade"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-4xl flex-col gap-4 rounded-xl bg-white p-5 font-sans text-stone-900 shadow-lg sm:inset-x-6 sm:flex-row sm:items-center sm:p-6"
        >
          <div className="min-w-0 flex-1">
            <h2 className="mb-1 text-base font-bold">
              Podemos analisar sua visita?
            </h2>
            <p className="text-sm leading-6 text-stone-600">
              Permita estatísticas de navegação e, quando habilitado, reprodução
              de sessões com Microsoft Clarity. Os campos do formulário ficam
              mascarados. Você pode recusar ou mudar sua escolha no rodapé.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Recusar
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Permitir análise
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
