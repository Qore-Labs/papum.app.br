"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface AdminMobileNavProps {
  children: ReactNode;
}

export function AdminMobileNav({ children }: AdminMobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const dialog = dialogRef.current;
    function closeOnDesktop() {
      if (!query.matches || !dialog?.open) return;
      dialog.dataset.instant = "true";
      dialog.inert = true;
      dialog.close();
      setIsOpen(false);
      document
        .querySelector<HTMLAnchorElement>(
          "[data-admin-sidebar] a[aria-current]",
        )
        ?.focus();
    }
    query.addEventListener("change", closeOnDesktop);
    return () => {
      query.removeEventListener("change", closeOnDesktop);
      if (dialog?.open) dialog.close();
    };
  }, []);

  function openMenu(instant: boolean) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.dataset.instant = String(instant);
    dialog.inert = false;
    dialog.showModal();
    setIsOpen(true);
  }

  function closeMenu(instant = false) {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    if (instant) dialog.dataset.instant = "true";
    dialog.inert = true;
    dialog.close();
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Abrir menu do painel"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="admin-mobile-navigation"
        onClick={(event) => openMenu(event.detail === 0)}
        className="flex size-11 items-center justify-center rounded-lg text-stone-900 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>
      <dialog
        id="admin-mobile-navigation"
        ref={dialogRef}
        className="admin-nav-dialog"
        aria-labelledby="admin-mobile-menu-title"
        onClose={() => setIsOpen(false)}
        onCancel={() => {
          if (dialogRef.current) {
            dialogRef.current.dataset.instant = "true";
            dialogRef.current.inert = true;
          }
        }}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            closeMenu(event.detail === 0);
            return;
          }
          if (event.target !== event.currentTarget) return;
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            closeMenu();
        }}
      >
        <div className="flex h-full flex-col p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2
              id="admin-mobile-menu-title"
              className="font-jakarta text-lg font-bold"
            >
              Menu do painel
            </h2>
            <button
              type="button"
              aria-label="Fechar menu do painel"
              onClick={(event) => closeMenu(event.detail === 0)}
              className="flex size-11 items-center justify-center rounded-lg hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </dialog>
    </div>
  );
}
