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
import {
  isValidClarityId,
  type GoogleAnalyticsConfig,
} from "@/utils/config/analytics";

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
  hostname?: string;
  google?: GoogleAnalyticsConfig;
  clarityProjectId?: string;
}
const serverConsent = () => null;
const subscribeClientReady = () => () => {};
const clientReadySnapshot = () => true;
const serverReadySnapshot = () => false;

export function MarketingAnalytics({
  hostname,
  google,
  clarityProjectId,
}: MarketingAnalyticsProps) {
  const pathname = usePathname();
  const clientReady = useSyncExternalStore(
    subscribeClientReady,
    clientReadySnapshot,
    serverReadySnapshot,
  );
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    serverConsent,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const previousPage = useRef<string | null>(null);
  const googleStarted = useRef(false);
  const preferencesTrigger = useRef<HTMLElement | null>(null);
  const clarityEnabled = isValidClarityId(clarityProjectId);
  const enabled = Boolean(google) || clarityEnabled;
  const marketingPage = isMarketingPath(pathname);
  const canLoadAnalytics =
    clientReady &&
    hostname === window.location.hostname &&
    consent !== "denied" &&
    marketingPage;
  const clarityAllowed =
    canLoadAnalytics && clarityEnabled && isClarityLocationAllowed();

  useLayoutEffect(() => {
    if (clarityAllowed && clarityProjectId)
      configureClarity(
        clarityProjectId,
        readAnalyticsConsent() === "granted" ? "granted" : "denied",
      );
    else if (stopClarity()) window.location.reload();
  }, [clarityAllowed, clarityProjectId, pathname, consent]);

  useEffect(() => {
    if (!enabled || hostname !== window.location.hostname) return;
    function guardNavigation(event: MouseEvent) {
      if (
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
      if (url.origin !== window.location.origin) return;
      const leavesGoogle =
        googleStarted.current && !isMarketingPath(url.pathname);
      const leavesClarity = isClarityActive() && !isClarityUrlAllowed(url);
      if (!leavesGoogle && !leavesClarity) return;
      event.preventDefault();
      event.stopPropagation();
      if (leavesGoogle) pauseMarketingAnalytics();
      stopClarity();
      // A fresh document keeps loaded providers outside untracked routes.
      window.location.assign(url.href);
    }
    function guardHistory() {
      if (googleStarted.current && !isMarketingPath(window.location.pathname)) {
        pauseMarketingAnalytics();
        stopClarity();
        window.location.reload();
        return;
      }
      if (!isClarityLocationAllowed() && stopClarity())
        window.location.reload();
    }
    function resumeDocument(event: PageTransitionEvent) {
      if (
        !event.persisted ||
        !clarityProjectId ||
        readAnalyticsConsent() === "denied" ||
        !isClarityLocationAllowed()
      )
        return;
      if (stopClarity()) window.location.reload();
      else
        configureClarity(
          clarityProjectId,
          readAnalyticsConsent() === "granted" ? "granted" : "denied",
        );
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
  }, [enabled, clarityProjectId, hostname]);

  useEffect(() => {
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
  }, []);

  useLayoutEffect(() => {
    if (!google || !canLoadAnalytics) {
      pauseMarketingAnalytics();
      previousPage.current = null;
      if (!marketingPage && googleStarted.current) window.location.reload();
      return;
    }
    // Queue consent and the GTM startup event before next/script loads it.
    configureMarketingAnalytics(google.measurementId);
    googleStarted.current = true;
    if (previousPage.current !== pathname) {
      trackMarketingPage(pathname);
      previousPage.current = pathname;
    }
    return () => {
      pauseMarketingAnalytics();
    };
  }, [consent, google, canLoadAnalytics, marketingPage, pathname]);

  useEffect(() => {
    if (!canLoadAnalytics || !enabled) return;
    document.addEventListener("click", trackMarketingClick, true);
    return () =>
      document.removeEventListener("click", trackMarketingClick, true);
  }, [canLoadAnalytics, enabled]);

  if (!marketingPage && !preferencesOpen) return null;
  function choose(value: "granted" | "denied") {
    setAnalyticsConsent(value);
    setPreferencesOpen(false);
    preferencesTrigger.current?.focus();
  }

  return (
    <>
      {google && canLoadAnalytics && (
        <Script
          id="papum-google-tag-manager"
          src={`https://www.googletagmanager.com/gtm.js?id=${google.tagManagerId}`}
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
      {preferencesOpen ? (
        <section
          id="analytics-preferences"
          aria-label="Preferências de privacidade"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-4xl flex-col gap-4 rounded-xl bg-white p-5 font-sans text-stone-900 shadow-lg sm:inset-x-6 sm:flex-row sm:items-center sm:p-6"
        >
          <div className="min-w-0 flex-1">
            <h2 className="mb-1 text-base font-bold">
              Sua privacidade, sua escolha.
            </h2>
            <p className="text-sm leading-6 text-stone-600">
              A análise básica usa o modo sem cookies do Google Analytics e do
              Microsoft Clarity. Você pode desativar toda a análise ou permitir
              cookies de análise para acompanhar a navegação entre páginas. Os
              campos do formulário ficam mascarados e os recursos de publicidade
              permanecem desativados.
              <a href="/privacidade" className="ml-1 underline">
                Saiba mais
              </a>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Desativar análise
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Permitir cookies de análise
            </button>
          </div>
          <button
            type="button"
            aria-label="Fechar preferências"
            className="min-h-11 px-2 underline"
            onClick={() => {
              setPreferencesOpen(false);
              preferencesTrigger.current?.focus();
            }}
          >
            Fechar
          </button>
        </section>
      ) : null}
    </>
  );
}
