import Image from "next/image";
import Link from "next/link";

import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPopover } from "@/components/ui/admin-popover";
import { LogoWhite } from "@/components/ui/icons";
import { DASHBOARD_MANAGER } from "@/utils/contents/dashboard";

export function AdminHeader() {
  return (
    <header className="bg-admin-header relative z-30 h-20.5 shadow-xs">
      <div className="mx-auto flex h-full w-full items-center justify-between gap-3 px-4 lg:px-7.25">
        <Link
          href="/dashboard"
          aria-label="Pápum! — página inicial do painel"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
        >
          <LogoWhite
            aria-hidden="true"
            className="h-auto w-38 text-white sm:w-42.75"
          />
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            popoverTarget="admin-manager-menu"
            aria-label={`Abrir menu do gerente ${DASHBOARD_MANAGER.name}`}
            className="flex min-h-11 items-center gap-3 rounded-lg text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            <span className="hidden text-right sm:block">
              <span className="block text-xs leading-4 font-semibold">
                {DASHBOARD_MANAGER.name}
              </span>
              <span className="block text-[10px] leading-[15px] tracking-[-0.5px]">
                {DASHBOARD_MANAGER.role}
              </span>
            </span>
            <span className="relative block size-10 overflow-hidden rounded-lg ring-2 ring-stone-100">
              <Image
                src={DASHBOARD_MANAGER.avatar}
                alt=""
                width={480}
                height={320}
                sizes="84px"
                className="absolute -top-[4.22%] -left-[55.92%] h-[140%] w-[210%] max-w-none object-fill"
              />
            </span>
          </button>
          <AdminMobileNav>
            <AdminNav helpId="admin-mobile-help" />
          </AdminMobileNav>
        </div>
        <AdminPopover id="admin-manager-menu" title={DASHBOARD_MANAGER.name}>
          <p>Gerente · prévia do painel</p>
          <Link
            href="/login"
            className="mt-3 flex min-h-11 items-center rounded-lg bg-stone-100 px-4 font-semibold text-stone-900 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
          >
            Sair do painel
          </Link>
        </AdminPopover>
      </div>
    </header>
  );
}
