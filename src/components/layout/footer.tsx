import { LogoWhite } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";
import { FOOTER_LEGAL } from "@/utils/contents/footer";
import { hasMarketingAnalytics } from "@/utils/config/analytics";

interface FooterProps {
  prefetch?: boolean;
  analyticsEnabled?: boolean;
}

export function Footer({ analyticsEnabled = false }: FooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-[#d6d6d6]">
      <div className="site-safe-gutter mx-auto max-w-320 pt-16 pb-[calc(1.5rem+env(safe-area-inset-bottom))] [--site-gutter:2rem] max-sm:[--site-gutter:1.5rem] xl:pb-7.5">
        <div className="grid grid-cols-2 gap-8 px-6 max-sm:px-0 md:grid-cols-5">
          <div className="col-span-2">
            <LogoWhite
              role="img"
              aria-label="PáPum!"
              className="h-11 w-[116px] text-zinc-500"
            />
            <p className="mt-6 max-w-80 text-sm leading-[23px] text-zinc-600">
              {siteConfig.tagline}
            </p>
            {/* <div className="mt-5 flex gap-4">
              {FOOTER_SOCIAL_LINKS.map(
                ({ id, href, label, icon: Icon, iconClassName }) => (
                  <a
                    key={id}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-home-red flex size-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                  >
                    <Icon className={iconClassName} aria-hidden="true" />
                  </a>
                ),
              )}
            </div> */}
          </div>

          {/* {FOOTER_COLUMNS.map((column) => (
            <div key={column.id}>
              <h3 className="text-home-red text-xs font-semibold tracking-[0.05em] uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link: FooterLink) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-analytics-cta={link.analyticsCta}
                      data-analytics-location="footer"
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={
                        link.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      prefetch={prefetch}
                      className="focus-visible:outline-home-red rounded-sm text-sm leading-[23px] text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-200 px-6 pt-8 text-sm text-zinc-600 max-sm:px-0 sm:flex-row sm:items-center sm:justify-between xl:mt-13">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-zinc-600">{FOOTER_LEGAL.madeWith}</p>
          {analyticsEnabled && hasMarketingAnalytics() && (
            <button
              type="button"
              data-analytics-preferences
              aria-controls="analytics-preferences"
              className="min-h-11 text-left text-sm text-zinc-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Preferências de privacidade
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
