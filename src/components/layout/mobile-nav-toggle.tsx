"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isExternalHref } from "@/lib/utils";
import type { NavLink } from "@/utils/config/site";

interface MobileNavToggleProps {
  links: NavLink[];
}

const linkClassName =
  "flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-[active=true]:bg-white/15 motion-reduce:transition-none";

export function MobileNavToggle({ links }: MobileNavToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    function closeOnDesktop() {
      if (!desktopQuery.matches || !dialog?.open) return;

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      dialog.close();
      setIsOpen(false);
    }

    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => {
      desktopQuery.removeEventListener("change", closeOnDesktop);
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (dialog?.open) dialog.close();
    };
  }, []);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    window.requestAnimationFrame(() => {
      if (dialog.open && closeTimeoutRef.current === null) setIsOpen(true);
    });
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimeoutRef.current !== null) return;

    setIsOpen(false);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 160
      : 260;

    closeTimeoutRef.current = window.setTimeout(() => {
      dialog.close();
      closeTimeoutRef.current = null;
      triggerRef.current?.focus();
    }, duration);
  }

  function closeOnBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      closeMenu();
    }
  }

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={openMenu}
        className="flex size-11 items-center justify-center rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-menu-title"
        className="mobile-nav-dialog"
        data-open={isOpen}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClick={closeOnBackdropClick}
      >
        <div className="flex min-h-full flex-col px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <h2 id="mobile-menu-title" className="text-xl font-bold text-white">
              Menu
            </h2>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMenu}
              className="flex size-11 items-center justify-center rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <nav
            id="mobile-navigation"
            aria-label="Navegação principal"
            className="mt-12 flex flex-col gap-2"
          >
            {links.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  data-analytics-cta={link.analyticsCta}
                  data-analytics-location="mobile_menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  data-analytics-cta={link.analyticsCta}
                  data-analytics-location="mobile_menu"
                  target={link.openInNewTab ? "_blank" : undefined}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className={linkClassName}
                  data-active={link.href === pathname}
                  aria-current={link.href === pathname ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <Link
            href="/lancamento"
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-cta="start_now"
            data-analytics-location="mobile_menu"
            onClick={closeMenu}
            className="mt-auto flex min-h-12 items-center justify-center rounded-full bg-[#ffbb00] px-6 text-base font-semibold text-[#613100] transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            Começar agora
          </Link>
        </div>
      </dialog>
    </div>
  );
}
