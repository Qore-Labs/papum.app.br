"use client";

import { useState, type ReactNode } from "react";

import { AdminToolbar } from "@/components/layout/admin-toolbar";
import { Button } from "@/components/ui/button";
import {
  AdminCalendarIcon,
  AdminDownloadIcon,
  AdminSearchIcon,
} from "@/components/ui/icons";
import {
  createDashboardOrdersCsv,
  filterDashboardOrders,
} from "@/lib/dashboard";
import type {
  DashboardOrderPresentation,
  DashboardPeriodId,
} from "@/types/dashboard";
import { DASHBOARD_PERIODS } from "@/utils/contents/dashboard";

interface OrdersWorkspaceProps {
  orders: DashboardOrderPresentation[];
  heading: ReactNode;
  toolbarActions: ReactNode;
}

export function OrdersWorkspace({
  orders,
  heading,
  toolbarActions,
}: OrdersWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<DashboardPeriodId>("24h");
  const visibleOrders = filterDashboardOrders(orders, query, period);

  function exportReport() {
    if (!visibleOrders.length) return;
    const blob = new Blob([createDashboardOrdersCsv(visibleOrders)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `papum-pedidos-${period}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <>
      <AdminToolbar actions={toolbarActions}>
        <div
          role="search"
          aria-label="Busca de pedidos e clientes"
          className="relative min-w-0 flex-1 lg:max-w-112"
        >
          <label htmlFor="dashboard-order-search" className="sr-only">
            Buscar pedidos, clientes
          </label>
          <AdminSearchIcon
            aria-hidden="true"
            className="text-home-orange pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            id="dashboard-order-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pedidos, clientes..."
            autoComplete="off"
            className="bg-admin-input h-11 w-full rounded-xl py-3 pr-4 pl-12 text-base text-stone-900 outline-hidden placeholder:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 focus-visible:outline-solid lg:h-10 lg:text-sm"
          />
        </div>
      </AdminToolbar>

      <div className="space-y-8 px-4 py-8 sm:px-8 lg:pr-5.75">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between xl:gap-4 xl:pr-2.25">
          {heading}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative sm:flex-initial">
              <AdminCalendarIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-stone-900"
              />
              <label htmlFor="dashboard-order-period" className="sr-only">
                Período dos pedidos
              </label>
              <select
                id="dashboard-order-period"
                value={period}
                onChange={(event) => {
                  const nextPeriod = DASHBOARD_PERIODS.find(
                    (item) => item.id === event.target.value,
                  );
                  if (nextPeriod) setPeriod(nextPeriod.id);
                }}
                className="bg-admin-control h-11 w-full cursor-pointer appearance-none rounded-xl py-2.5 pr-5 pl-10.5 text-sm leading-5 font-semibold outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 focus-visible:outline-solid xl:h-10"
              >
                {DASHBOARD_PERIODS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              onClick={exportReport}
              disabled={!visibleOrders.length}
              className="from-home-orange h-11 gap-2 rounded-xl bg-linear-[167.67deg_in_srgb] to-[#e6182a] px-5 py-2.5 text-sm leading-5 font-semibold text-black text-white shadow-[0_10px_15px_-3px_rgba(154,70,0,0.2),0_4px_6px_-4px_rgba(154,70,0,0.2)] hover:opacity-90 focus-visible:outline-stone-700 xl:h-10"
            >
              <AdminDownloadIcon aria-hidden="true" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        <section id="recent-orders" aria-labelledby="recent-orders-title">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2">
            <h2
              id="recent-orders-title"
              className="font-jakarta text-xl leading-7 font-bold"
            >
              Pedidos Recentes
            </h2>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPeriod("24h");
              }}
              className="min-h-11 rounded-sm text-xs leading-4 font-semibold text-stone-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 lg:min-h-7"
            >
              Ver Todos os Pedidos
            </button>
          </div>
          <p role="status" className="sr-only">
            {visibleOrders.length}{" "}
            {visibleOrders.length === 1
              ? "pedido encontrado"
              : "pedidos encontrados"}
            .
          </p>
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.04)] md:block">
            <table className="w-full table-fixed text-center text-sm">
              <caption className="sr-only">Pedidos recentes</caption>
              <colgroup>
                <col className="w-[18.5%]" />
                <col className="w-[24.8%]" />
                <col className="w-[20.7%]" />
                <col className="w-[19.8%]" />
                <col className="w-[16.2%]" />
              </colgroup>
              <thead className="h-14 bg-stone-50/50 text-[10px] leading-4 font-semibold tracking-[1px] text-stone-600 uppercase">
                <tr>
                  <th scope="col">ID do Pedido</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Status</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Hora</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.length ? (
                  visibleOrders.map((order) => order.tableRow)
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-stone-600">
                      Nenhum pedido encontrado. Tente outro número ou nome de
                      cliente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ul aria-label="Pedidos recentes" className="space-y-4 md:hidden">
            {visibleOrders.map((order) => order.mobileCard)}
          </ul>
          {!visibleOrders.length && (
            <p className="rounded-2xl bg-white p-6 text-sm leading-6 text-stone-600 md:hidden">
              Nenhum pedido encontrado. Tente outro número ou nome de cliente.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
