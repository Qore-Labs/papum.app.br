"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
}
const serverConsent = () => null;

export function MarketingAnalytics({ measurementId }: MarketingAnalyticsProps) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    serverConsent,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const previousPage = useRef<string | null>(null);
  const preferencesTrigger = useRef<HTMLElement | null>(null);
  const enabled = Boolean(measurementId && /^G-[A-Z0-9]+$/.test(measurementId));
  const marketingPage = isMarketingPath(pathname);

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
    if (!enabled || !measurementId || consent !== "granted" || !marketingPage) {
      pauseMarketingAnalytics();
      previousPage.current = null;
      return;
    }
    configureMarketingAnalytics(measurementId);
    if (previousPage.current !== pathname) {
      trackMarketingPage(pathname);
      previousPage.current = pathname;
    }
    document.addEventListener("click", trackMarketingClick, true);
    return () => {
      document.removeEventListener("click", trackMarketingClick, true);
      pauseMarketingAnalytics();
    };
  }, [consent, enabled, marketingPage, measurementId, pathname]);

  if (!enabled || !marketingPage) return null;
  function choose(value: "granted" | "denied") {
    setAnalyticsConsent(value);
    setPreferencesOpen(false);
    preferencesTrigger.current?.focus();
  }

  return (
    <>
      {consent === "granted" && (
        <Script
          id="papum-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
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
              Podemos medir sua visita?
            </h2>
            <p className="text-sm leading-6 text-stone-600">
              Com sua permissão, usamos cookies para entender quais páginas e
              botões ajudam você. Seu e-mail não entra nessas estatísticas.
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
              Permitir estatísticas
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
