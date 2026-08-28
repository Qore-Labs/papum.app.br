"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { NavLink } from "@/utils/config/site";

interface MobileNavToggleProps {
  links: NavLink[];
}

export function MobileNavToggle({ links }: MobileNavToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-white"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {isOpen && (
        <nav className="bg-brand-orange absolute inset-x-0 top-full flex flex-col gap-1 px-4 pb-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10 data-[active=true]:bg-white/10"
              data-active={link.href === pathname}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
