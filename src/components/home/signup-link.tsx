"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { MarketingLocation } from "@/lib/analytics";

export function SignupLink({
  location,
  children = "Cadastrar-se",
  className = "",
}: {
  location: MarketingLocation;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/#cadastro"
      prefetch={false}
      data-analytics-cta="start_now"
      data-analytics-location={location}
      className={`landing-button ${className}`}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (!document.getElementById("cadastro")) return;
        event.preventDefault();
        history.replaceState(null, "", "#cadastro");
        document.getElementById("cadastro")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "center",
        });
        document
          .getElementById("waitlist-email")
          ?.focus({ preventScroll: true });
      }}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}
