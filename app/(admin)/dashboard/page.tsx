import type { Metadata } from "next";
import Image from "next/image";

import { OrdersWorkspace } from "@/components/dashboard/orders-workspace";
import { AdminHelpPopover } from "@/components/dashboard/admin-help-popover";
import { AdminToolbarActions } from "@/components/layout/admin-toolbar";
import { cn } from "@/lib/utils";
import type { DashboardOrder } from "@/types/dashboard";
import { siteConfig } from "@/utils/config/site";
import {
  DASHBOARD_DEMO_ORDERS,
  DASHBOARD_ORDER_STATUSES,
} from "@/utils/contents/dashboard";

export const metadata: Metadata = {
  title: `Visão Geral | ${siteConfig.name} Gestão`,
  description: "Painel de gestão de pedidos e logística do Pápum! Delivery.",
  alternates: { canonical: "/dashboard" },
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function CustomerAvatar({ order }: { order: DashboardOrder }) {
  return (
    <span className="relative block h-8 w-7.5 shrink-0 overflow-hidden rounded-full bg-stone-200">
      <Image
        src={order.avatar.src}
        alt=""
        width={order.avatar.width}
        height={order.avatar.height}
        sizes="32px"
        className={order.avatar.className}
      />
    </span>
  );
}

function OrderStatus({ status }: { status: DashboardOrder["status"] }) {
  const presentation = DASHBOARD_ORDER_STATUSES[status];
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-[10px] leading-3 font-semibold whitespace-nowrap",
        presentation.className,
      )}
    >
      {presentation.label}
    </span>
  );
}

function OrderTableRow({ order }: { order: DashboardOrder }) {
  return (
    <tr className={cn("border-t border-stone-50", order.rowClassName)}>
      <th scope="row" className="font-semibold">
        #{order.id}
      </th>
      <td className="pl-3">
        <span className="flex items-center justify-center gap-3">
          <CustomerAvatar order={order} />
          <span className="w-21 text-left font-medium text-stone-700">
            {order.customer}
          </span>
        </span>
      </td>
      <td>
        <OrderStatus status={order.status} />
      </td>
      <td className="font-semibold tabular-nums">
        {currencyFormatter.format(order.amount)}
      </td>
      <td className="text-xs font-medium text-stone-600 tabular-nums">
        {order.time}
      </td>
    </tr>
  );
}

function OrderMobileCard({ order }: { order: DashboardOrder }) {
  return (
    <li className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">#{order.id}</span>
        <OrderStatus status={order.status} />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <CustomerAvatar order={order} />
        <span className="text-base font-medium text-stone-700">
          {order.customer}
        </span>
      </div>
      <dl className="flex items-end justify-between gap-4 border-t border-stone-100 pt-3">
        <div>
          <dt className="mb-1 text-xs text-stone-600">Valor</dt>
          <dd className="text-base font-semibold tabular-nums">
            {currencyFormatter.format(order.amount)}
          </dd>
        </div>
        <div className="text-right">
          <dt className="mb-1 text-xs text-stone-600">Hora</dt>
          <dd className="text-sm font-medium text-stone-600 tabular-nums">
            {order.time}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function DashboardPage() {
  return (
    <main id="admin-main" tabIndex={-1} className="min-w-0 outline-none">
      <div className="px-4 pt-5 sm:px-8 lg:pt-5.5 lg:pr-5.5">
        <div className="relative aspect-[970/245] overflow-hidden rounded-[15.313px]">
          <Image
            src="/admin/dashboard/restaurant-banner.png"
            alt="Casa de Chico Delivery App: burgers, pizzas e pokes. Peça pelo app, com entrega rápida e grátis."
            width={2064}
            height={512}
            preload
            sizes="(min-width: 1024px) calc(100vw - 310px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
            className="absolute top-[0.39%] left-0 h-[99.22%] w-full object-fill"
          />
        </div>
      </div>
      <OrdersWorkspace
        toolbarActions={
          <AdminToolbarActions
            helpId="admin-toolbar-help"
            help={<AdminHelpPopover id="admin-toolbar-help" />}
          />
        }
        heading={
          <div className="min-w-0">
            <h1 className="font-jakarta text-[26px] leading-8 font-extrabold tracking-[-0.75px] sm:text-3xl sm:leading-9">
              Visão Geral
            </h1>
            <p className="mt-1 text-sm leading-5 text-stone-600">
              Monitoramento de logística e saúde do negócio em tempo real
            </p>
          </div>
        }
        orders={DASHBOARD_DEMO_ORDERS.map((order) => ({
          id: order.id,
          customer: order.customer,
          status: order.status,
          amount: order.amount,
          time: order.time,
          ageInHours: order.ageInHours,
          tableRow: <OrderTableRow key={order.id} order={order} />,
          mobileCard: <OrderMobileCard key={order.id} order={order} />,
        }))}
      />
    </main>
  );
}
