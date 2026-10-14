import type { ReactNode } from "react";

import { AdminPopover } from "@/components/ui/admin-popover";
import { AdminBellIcon, AdminHelpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface AdminToolbarProps {
  children: ReactNode;
  actions: ReactNode;
}

export function AdminToolbar({ children, actions }: AdminToolbarProps) {
  return (
    <div className="bg-admin-surface relative z-10 flex min-h-20 items-center justify-between gap-3 px-4 py-3 shadow-[0_20px_20px_rgba(0,0,0,0.05)] sm:px-8 lg:h-20 lg:py-0 lg:pr-2.75">
      {children}
      {actions}
    </div>
  );
}

interface AdminToolbarActionsProps {
  helpId: string;
  help: ReactNode;
  indicatorClassName?: string;
}

export function AdminToolbarActions({
  helpId,
  help,
  indicatorClassName,
}: AdminToolbarActionsProps) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 sm:gap-5.5">
        <button
          type="button"
          popoverTarget="admin-notifications"
          aria-label="Ver notificações"
          className="relative flex size-11 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
        >
          <AdminBellIcon aria-hidden="true" />
          <span
            aria-hidden="true"
            className={cn(
              "bg-home-red absolute top-2.5 right-3 size-2 rounded-full",
              indicatorClassName,
            )}
          />
        </button>
        <button
          type="button"
          popoverTarget={helpId}
          aria-label="Abrir ajuda"
          className="flex size-11 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
        >
          <AdminHelpIcon aria-hidden="true" />
        </button>
      </div>
      <AdminPopover id="admin-notifications" title="Notificações">
        <ul className="space-y-3">
          <li>
            <strong className="font-semibold text-stone-900">
              Pedido #KD-9281
            </strong>
            <p>O pedido de Alice Silva está em trânsito.</p>
          </li>
          <li>
            <strong className="font-semibold text-stone-900">
              Pedido #KD-9280
            </strong>
            <p>O pedido de João Diniz foi entregue.</p>
          </li>
        </ul>
        <p className="mt-4 text-xs text-stone-600">
          Atualizações de demonstração.
        </p>
      </AdminPopover>
      {help}
    </>
  );
}
