import { AdminHelpPopover } from "@/components/dashboard/admin-help-popover";
import { AdminNavLink } from "@/components/layout/admin-nav-link";
import { AdminSupportIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/utils/contents/dashboard";

interface AdminNavProps {
  helpId: string;
  className?: string;
}

export function AdminNav({ helpId, className }: AdminNavProps) {
  const itemClassName =
    "flex min-h-11 w-full items-center rounded-lg px-4 py-3 text-sm leading-5 font-medium tracking-[0.35px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700";
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <nav aria-label="Navegação do painel" className="space-y-2">
        {DASHBOARD_NAV_ITEMS.map(
          ({ id, label, href, available, offset, icon: Icon }) =>
            available ? (
              <AdminNavLink
                key={id}
                href={href}
                className={cn(itemClassName, offset && "lg:translate-x-1")}
              >
                <Icon aria-hidden="true" className="shrink-0" />
                {label}
              </AdminNavLink>
            ) : (
              <button
                key={id}
                type="button"
                disabled
                title="Disponível em breve"
                className={cn(
                  itemClassName,
                  "cursor-not-allowed text-stone-500",
                )}
              >
                <Icon aria-hidden="true" className="shrink-0" />
                {label}
              </button>
            ),
        )}
      </nav>
      <div className="mt-auto border-t border-[#cbcbcb]/30 pt-6">
        <button
          type="button"
          popoverTarget={helpId}
          className={cn(
            itemClassName,
            "bg-[#e5e5e5] text-stone-600 hover:bg-stone-200",
          )}
        >
          <AdminSupportIcon aria-hidden="true" className="shrink-0" />
          Suporte
        </button>
      </div>
      <AdminHelpPopover id={helpId} />
    </div>
  );
}
