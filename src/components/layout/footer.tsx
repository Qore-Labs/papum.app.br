import Link from "next/link";
import { LogoWhite, InstagramIcon, GlobeIcon } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";
import { hasMarketingAnalytics } from "@/utils/config/analytics";

interface FooterProps {
  prefetch?: boolean;
  analyticsEnabled?: boolean;
}
export function Footer({ analyticsEnabled = false }: FooterProps) {
  return (
    <footer className="text-home-ink bg-[#f0eee7]">
      <div className="site-safe-gutter mx-auto max-w-320 py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <LogoWhite
              role="img"
              aria-label="Papum Delivery"
              className="text-home-ink h-auto w-36"
            />
            <p className="mt-5 max-w-64 text-sm leading-7 text-[#625c53]">
              {siteConfig.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (nova aba)"
              className="inline-flex min-h-11 items-center gap-3 underline-offset-4 hover:underline"
            >
              <InstagramIcon className="size-5" aria-hidden="true" />
              Instagram
            </a>
            <Link href="/" className="inline-flex min-h-11 items-center gap-3">
              <GlobeIcon className="size-5" aria-hidden="true" />
              Papum Delivery
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#d9d5ca] pt-6 text-xs text-[#625c53] sm:flex-row sm:items-center">
          <p>{new Date().getFullYear()} Papum Delivery.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacidade"
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              Privacidade
            </Link>
            {analyticsEnabled && hasMarketingAnalytics() && (
              <button
                type="button"
                data-analytics-preferences
                aria-controls="analytics-preferences"
                className="min-h-11 cursor-pointer underline underline-offset-4"
              >
                Preferências de privacidade
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
