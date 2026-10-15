"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileOptions {
  sitekey: string;
  action: string;
  theme: "dark";
  size: "flexible";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: TurnstileOptions) => string;
      remove: (id: string) => void;
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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const turnstile = window.turnstile;
    const widget = turnstile.render(container.current, {
      sitekey: siteKey,
      action: "launch_waitlist",
      theme: "dark",
      size: "flexible",
      callback: (token) => {
        setFailed(false);
        onToken(token);
      },
      "expired-callback": onInvalid,
      "error-callback": () => {
        setFailed(true);
        onInvalid();
      },
    });
    return () => turnstile.remove(widget);
  }, [onInvalid, onToken, ready, siteKey]);
  return (
    <div className="mt-4">
      <Script
        id="papum-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => {
          setFailed(true);
          onInvalid();
        }}
      />
      <div ref={container} aria-label="Verificação de segurança" />
      {failed && (
        <p role="alert" className="mt-2 text-sm text-red-200">
          Não foi possível carregar a verificação. Recarregue a página para
          tentar novamente.
        </p>
      )}
    </div>
  );
}
