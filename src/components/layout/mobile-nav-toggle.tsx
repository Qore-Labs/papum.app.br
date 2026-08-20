"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

interface MobileNavToggleProps {
  links: { href: string; label: string }[];
}

export function MobileNavToggle({ links }: MobileNavToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
