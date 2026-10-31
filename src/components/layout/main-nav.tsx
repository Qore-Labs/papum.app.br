"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLink } from "@/utils/config/site";

interface MainNavProps {
  links: NavLink[];
}

const linkClassName =
  "border-b-2 border-transparent pb-0.5 text-base leading-6 text-home-ink hover:text-[#715000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-ink data-[active=true]:border-[#ffbb00] data-[active=true]:font-semibold data-[active=true]:text-home-ink";

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="hidden items-center gap-[34px] md:flex"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={
            link.href.startsWith("#") &&
            pathname !== "/" &&
            pathname !== "/instagram"
              ? `/${link.href}`
              : link.href
          }
          data-analytics-cta={link.analyticsCta}
          data-analytics-location="header"
          target={link.openInNewTab ? "_blank" : undefined}
          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
          aria-label={
            link.openInNewTab ? `${link.label} (abre em nova aba)` : undefined
          }
          className={linkClassName}
          data-active={link.href === pathname}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
