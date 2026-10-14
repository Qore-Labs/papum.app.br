import { UserRound } from "lucide-react";

import { AdminPopover } from "@/components/ui/admin-popover";
import { AdminMoreIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Customer, CustomerAvatarPresentation } from "@/types/customers";
import { CUSTOMER_STATUSES } from "@/utils/contents/customers";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const actionClassName =
  "min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent-ink";

interface CustomerIdentityProps {
  customer: Customer;
  avatars: CustomerAvatarPresentation[];
}

function CustomerIdentity({ customer, avatars }: CustomerIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 ring-2 ring-stone-100">
        {avatars.find((avatar) => avatar.id === customer.avatarId)?.image ?? (
          <UserRound aria-hidden="true" className="size-5 text-stone-500" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-base leading-5 font-semibold wrap-break-word text-stone-900">
          {customer.name}
        </p>
        <p className="text-xs leading-4 wrap-anywhere text-stone-500">
          {customer.email}
        </p>
      </div>
    </div>
  );
}

function CustomerStatusBadge({ customer }: { customer: Customer }) {
  const status = CUSTOMER_STATUSES[customer.status];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs leading-4 font-semibold",
        status.className,
      )}
    >
      {status.label}
    </span>
  );
}

interface CustomerActionsProps {
  customer: Customer;
  layout: "table" | "card";
  onEdit: () => void;
  onToggle: () => void;
}

function CustomerActions({
  customer,
  layout,
  onEdit,
  onToggle,
}: CustomerActionsProps) {
  const popoverId = `customer-actions-${layout}-${customer.id}`;
  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        aria-label={`Ações de ${customer.name}`}
        className="focus-visible:outline-admin-accent-ink ml-auto flex size-11 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 lg:size-8"
      >
        <AdminMoreIcon aria-hidden="true" />
      </button>
      <AdminPopover id={popoverId} title={`Ações de ${customer.name}`}>
        <button
          type="button"
          onClick={onEdit}
          popoverTarget={popoverId}
          popoverTargetAction="hide"
          aria-haspopup="dialog"
          className={actionClassName}
        >
          Editar cliente
        </button>
        <button
          type="button"
          onClick={onToggle}
          popoverTarget={popoverId}
          popoverTargetAction="hide"
          className={actionClassName}
        >
          {customer.status === "inactive"
            ? "Ativar cliente"
            : "Desativar cliente"}
        </button>
      </AdminPopover>
    </>
  );
}

interface CustomersListProps {
  customers: Customer[];
  avatars: CustomerAvatarPresentation[];
  onEdit: (customer: Customer) => void;
  onToggle: (customer: Customer) => void;
}

export function CustomersList({
  customers,
  avatars,
  onEdit,
  onToggle,
}: CustomersListProps) {
  return (
    <>
      <div className="hidden xl:block">
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">Clientes da prévia</caption>
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[17%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="h-16.25 border-b border-stone-50 text-[10px] leading-4 font-semibold tracking-[1.5px] text-stone-500 uppercase">
            <tr>
              <th scope="col" className="px-8">
                Cliente
              </th>
              <th scope="col" className="px-4">
                Contato
              </th>
              <th scope="col" className="px-5">
                Status
              </th>
              <th scope="col" className="px-2 text-center">
                Último pedido
              </th>
              <th scope="col" className="px-6">
                Total gasto
              </th>
              <th scope="col" className="px-8 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                id={`customer-table-${customer.id}`}
                tabIndex={-1}
                className="focus-visible:outline-admin-accent-ink h-20.25 border-b border-stone-50 outline-hidden last:border-b-0 focus-visible:outline-2 focus-visible:-outline-offset-2"
              >
                <td className="py-5 pr-2 pl-10">
                  <CustomerIdentity customer={customer} avatars={avatars} />
                </td>
                <td className="px-4 py-5 text-stone-600">
                  <span className="whitespace-nowrap">{customer.phone}</span>
                </td>
                <td className="px-5 py-5">
                  <CustomerStatusBadge customer={customer} />
                </td>
                <td className="px-2 py-5 text-center text-stone-600">
                  {customer.lastOrder}
                </td>
                <td className="px-6 py-5 font-semibold text-stone-900 tabular-nums">
                  {currencyFormatter.format(customer.totalSpent)}
                </td>
                <td className="py-5 pr-8">
                  <CustomerActions
                    customer={customer}
                    layout="table"
                    onEdit={() => onEdit(customer)}
                    onToggle={() => onToggle(customer)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul
        aria-label="Clientes da prévia"
        className="divide-y divide-stone-100 xl:hidden"
      >
        {customers.map((customer) => (
          <li
            key={customer.id}
            id={`customer-card-${customer.id}`}
            tabIndex={-1}
            className="focus-visible:outline-admin-accent-ink space-y-5 p-5 outline-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 sm:p-6"
          >
            <div className="flex items-start justify-between gap-2">
              <CustomerIdentity customer={customer} avatars={avatars} />
              <CustomerActions
                customer={customer}
                layout="card"
                onEdit={() => onEdit(customer)}
                onToggle={() => onToggle(customer)}
              />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm leading-5">
              <div>
                <dt className="mb-1 text-xs text-stone-500">Contato</dt>
                <dd className="wrap-break-word text-stone-700">
                  {customer.phone}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-stone-500">Status</dt>
                <dd>
                  <CustomerStatusBadge customer={customer} />
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-stone-500">Último pedido</dt>
                <dd className="text-stone-700">{customer.lastOrder}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-stone-500">Total gasto</dt>
                <dd className="font-semibold text-stone-900 tabular-nums">
                  {currencyFormatter.format(customer.totalSpent)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
