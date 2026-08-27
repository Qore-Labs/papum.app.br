import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/utils/config/site";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_SOCIAL_LINKS,
} from "@/utils/contents/footer";

export function Footer() {
  return (
    <footer className="bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/home/papum-logo-footer.png"
              alt="pápum!"
              width={116}
              height={43}
              className="h-9 w-auto opacity-70"
            />
            <p className="mt-4 max-w-xs text-sm text-zinc-500">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {FOOTER_SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-brand-red text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{FOOTER_LEGAL.copyright}</p>
          <p>{FOOTER_LEGAL.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
