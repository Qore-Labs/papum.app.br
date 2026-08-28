"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isExternalHref } from "@/lib/utils";
import type { NavLink } from "@/utils/config/site";

interface MainNavProps {
  links: NavLink[];
}

const linkClassName =
  "text-sm font-medium text-white/90 hover:text-white data-[active=true]:text-white data-[active=true]:underline data-[active=true]:underline-offset-4";

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {links.map((link) =>
        isExternalHref(link.href) ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className={linkClassName}
            data-active={link.href === pathname}
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
