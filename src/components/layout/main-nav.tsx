"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLink } from "@/utils/config/site";

interface MainNavProps {
  links: NavLink[];
}

const linkClassName =
  "border-b-2 border-transparent pb-0.5 text-base leading-6 text-[#613100] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-[active=true]:border-[#ffbb00] data-[active=true]:font-semibold data-[active=true]:text-white";

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
          href={link.href}
          className={linkClassName}
          data-active={link.href === pathname}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
