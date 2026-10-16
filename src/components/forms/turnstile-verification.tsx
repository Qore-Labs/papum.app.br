"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { getTurnstileFailure, type TurnstileFailure } from "@/lib/turnstile";

interface TurnstileOptions {
  sitekey: string;
  action: string;
  theme: "dark";
  size: "flexible";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": (code?: string) => boolean;
  "timeout-callback": () => void;
}
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: TurnstileOptions) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
interface TurnstileVerificationProps {
  siteKey: string;
  onToken: (token: string) => void;
  onInvalid: () => void;
}

export function TurnstileVerification({
  siteKey,
  onToken,
  onInvalid,
}: TurnstileVerificationProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<TurnstileFailure | null>(null);
  const [scriptFailed, setScriptFailed] = useState(false);
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const turnstile = window.turnstile;
    let cancelled = false;
    function fail(code?: string) {
      if (cancelled) return;
      setFailure(getTurnstileFailure(code));
      onInvalid();
    }
    try {
      widgetId.current = turnstile.render(container.current, {
        sitekey: siteKey,
        action: "launch_waitlist",
        theme: "dark",
        size: "flexible",
        callback: (token) => {
          if (cancelled) return;
          setFailure(null);
          onToken(token);
        },
        "expired-callback": () => {
          if (!cancelled) onInvalid();
        },
        "timeout-callback": () => fail("110620"),
        "error-callback": (code) => {
          fail(code);
          return true;
        },
      });
    } catch {
      // A rejected SDK initialization must not crash the contact form.
      queueMicrotask(() => fail());
    }
    return () => {
      cancelled = true;
      if (widgetId.current !== null) {
        try {
          turnstile.remove(widgetId.current);
        } catch {
          /* The SDK may already have removed an invalid widget. */
        }
      }
      widgetId.current = null;
    };
  }, [onInvalid, onToken, ready, siteKey]);

  function retry() {
    if (scriptFailed || !window.turnstile || widgetId.current === null) {
      window.location.reload();
      return;
    }
    setFailure(null);
    onInvalid();
    container.current?.focus();
    try {
      window.turnstile.reset(widgetId.current);
    } catch {
      setFailure(getTurnstileFailure(null));
    }
  }
  return (
    <div className="mt-4">
      <Script
        id="papum-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => {
          setScriptFailed(true);
          setFailure(getTurnstileFailure(null));
          onInvalid();
        }}
      />
      <div
        ref={container}
        role="group"
        tabIndex={-1}
        aria-label="Verificação de segurança"
        className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      />
      {failure && (
        <div className="mt-3 text-center">
          <p role="alert" className="text-sm leading-6 text-red-200">
            {failure.message}
          </p>
          {failure.code && (
            <p className="mt-1 text-xs text-zinc-300">
              Referência: {failure.code}
            </p>
          )}
          {failure.retryable && (
            <button
              type="button"
              onClick={retry}
              className="mt-2 min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white underline underline-offset-4 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {scriptFailed
                ? "Recarregar página"
                : "Tentar verificação novamente"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
