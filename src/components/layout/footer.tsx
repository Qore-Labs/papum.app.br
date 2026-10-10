import Link from "next/link";

import { LogoWhite } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_SOCIAL_LINKS,
} from "@/utils/contents/footer";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#d6d6d6]">
      <div className="mx-auto max-w-320 px-8 pt-16 pb-6 max-sm:px-6 xl:pb-7.5">
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
            <div className="mt-5 flex gap-4">
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
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.id}>
              <h3 className="text-home-red text-xs font-semibold tracking-[0.05em] uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-visible:outline-home-red rounded-sm text-sm leading-[23px] text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-200 px-6 pt-8 text-sm text-zinc-600 max-sm:px-0 sm:flex-row sm:items-center sm:justify-between xl:mt-13">
          <p>
            © {new Date().getFullYear()} PáPum! Delivery. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">{FOOTER_LEGAL.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
