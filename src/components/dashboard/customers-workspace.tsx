"use client";

import { useState, type ReactNode } from "react";

import { CustomersList } from "@/components/dashboard/customers-list";
import { CustomerForm } from "@/components/forms/customer-form";
import { AdminToolbar } from "@/components/layout/admin-toolbar";
import { Button } from "@/components/ui/button";
import {
  AdminAddCustomerIcon,
  AdminNextIcon,
  AdminPreviousIcon,
  AdminSearchIcon,
} from "@/components/ui/icons";
import { filterCustomers } from "@/lib/customers";
import { cn } from "@/lib/utils";
import type { CustomerFormValues } from "@/schemas/customer-form";
import type {
  Customer,
  CustomerAvatarPresentation,
  CustomerFilterId,
} from "@/types/customers";
import {
  CUSTOMER_FILTERS,
  CUSTOMERS_PAGE_SIZE,
} from "@/utils/contents/customers";

interface CustomersWorkspaceProps {
  initialCustomers: Customer[];
  avatars: CustomerAvatarPresentation[];
  heading: ReactNode;
  toolbarActions: ReactNode;
}

const pageButtonClassName =
  "flex size-11 items-center justify-center rounded-lg text-stone-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent-ink disabled:cursor-not-allowed disabled:opacity-50 xl:size-8";

export function CustomersWorkspace({
  initialCustomers,
  avatars,
  heading,
  toolbarActions,
}: CustomersWorkspaceProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CustomerFilterId>("all");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Customer | "new" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const matchingCustomers = filterCustomers(customers, query, filter);
  const pageCount = Math.max(
    1,
    Math.ceil(matchingCustomers.length / CUSTOMERS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * CUSTOMERS_PAGE_SIZE;
  const visibleCustomers = matchingCustomers.slice(
    start,
    start + CUSTOMERS_PAGE_SIZE,
  );

  function resetFilters() {
    setQuery("");
    setFilter("all");
    setPage(1);
    setAnnouncement("");
  }

  function saveCustomer(values: CustomerFormValues) {
    const existing = editor && editor !== "new" ? editor : null;
    const customer: Customer = {
      ...values,
      id: existing?.id ?? crypto.randomUUID(),
      avatarId: existing?.avatarId ?? null,
      lastOrder: existing?.lastOrder ?? "Sem pedidos",
      lastOrderAgeInDays: existing?.lastOrderAgeInDays ?? null,
      totalSpent: existing?.totalSpent ?? 0,
    };
    setCustomers((current) =>
      existing
        ? current.map((item) => (item.id === customer.id ? customer : item))
        : [...current, customer],
    );
    setQuery("");
    setFilter("all");
    setPage(
      existing
        ? Math.floor(
            customers.findIndex((item) => item.id === customer.id) /
              CUSTOMERS_PAGE_SIZE,
          ) + 1
        : Math.floor(customers.length / CUSTOMERS_PAGE_SIZE) + 1,
    );
    setEditor(null);
    setAnnouncement(`${customer.name} salvo nesta prévia.`);
    requestAnimationFrame(() => {
      const layout = window.matchMedia("(min-width: 1280px)").matches
        ? "table"
        : "card";
      document.getElementById(`customer-${layout}-${customer.id}`)?.focus();
    });
  }

  function toggleCustomer(customer: Customer) {
    const status = customer.status === "inactive" ? "active" : "inactive";
    setCustomers((current) =>
      current.map((item) =>
        item.id === customer.id ? { ...item, status } : item,
      ),
    );
    setAnnouncement(
      `${customer.name} ${status === "inactive" ? "desativado" : "ativado"} nesta prévia.`,
    );
    if (filter === "most-active" && status === "inactive") {
      requestAnimationFrame(() =>
        document.getElementById("customers-filter-most-active")?.focus(),
      );
    }
  }

  return (
    <>
      <AdminToolbar actions={toolbarActions}>
        <div
          role="search"
          aria-label="Busca de clientes"
          className="relative min-w-0 flex-1 lg:max-w-112"
        >
          <label htmlFor="customers-search" className="sr-only">
            Buscar clientes
          </label>
          <AdminSearchIcon
            aria-hidden="true"
            className="text-home-orange pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            id="customers-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              setAnnouncement("");
            }}
            placeholder="Buscar clientes..."
            autoComplete="off"
            className="bg-admin-input focus-visible:outline-admin-accent-ink h-11 w-full rounded-xl py-3 pr-4 pl-12 text-base text-stone-900 outline-hidden placeholder:text-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 lg:h-10 lg:text-sm"
          />
        </div>
      </AdminToolbar>
      <div className="space-y-10 px-4 py-8 sm:px-8 xl:pb-3.5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between xl:gap-6">
          {heading}
          <Button
            type="button"
            onClick={() => setEditor("new")}
            aria-haspopup="dialog"
            className="bg-admin-accent h-11 shrink-0 gap-2 rounded-xl px-5 text-sm leading-5 font-semibold text-white shadow-xs hover:bg-orange-400 xl:h-10"
          >
            <AdminAddCustomerIcon aria-hidden="true" />
            Novo Cliente
          </Button>
        </div>
        <section
          aria-labelledby="customers-list-title"
          className="rounded-[32px] bg-white shadow-[0_40px_80px_rgba(26,28,28,0.06)]"
        >
          <div className="flex min-h-18.25 flex-col justify-between gap-3 rounded-t-[32px] border-b border-stone-200/30 bg-[#f3f3f3] px-5 py-5 sm:flex-row sm:items-center sm:px-8 sm:py-6">
            <h2
              id="customers-list-title"
              className="font-jakarta text-base leading-6 font-semibold text-stone-900"
            >
              Listagem de Clientes
            </h2>
            <div
              role="group"
              aria-label="Filtrar clientes"
              className="flex flex-wrap items-center gap-x-3 sm:gap-x-6"
            >
              {CUSTOMER_FILTERS.map((item) => (
                <button
                  key={item.id}
                  id={`customers-filter-${item.id}`}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => {
                    setFilter(item.id);
                    setPage(1);
                    setAnnouncement("");
                  }}
                  className={cn(
                    "focus-visible:outline-admin-accent-ink min-h-11 min-w-11 border-b-2 text-xs leading-4 font-semibold tracking-[0.8px] focus-visible:outline-2 focus-visible:outline-offset-2 sm:tracking-[1.2px] xl:min-h-6 xl:min-w-0 xl:pb-1.5",
                    filter === item.id
                      ? "text-admin-accent-ink border-orange-600"
                      : "border-transparent text-stone-600 hover:text-stone-800",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <p role="status" className="sr-only">
            {announcement ||
              `${matchingCustomers.length} ${matchingCustomers.length === 1 ? "cliente encontrado" : "clientes encontrados"}.`}
          </p>
          {visibleCustomers.length ? (
            <CustomersList
              customers={visibleCustomers}
              avatars={avatars}
              onEdit={setEditor}
              onToggle={toggleCustomer}
            />
          ) : (
            <div className="px-5 py-16 text-center">
              <h3 className="font-jakarta text-lg font-bold">
                Nenhum cliente encontrado
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Tente outro nome, e-mail ou telefone, ou limpe os filtros.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={resetFilters}
                className="mt-5 h-11"
              >
                Limpar filtros
              </Button>
            </div>
          )}
          <div className="flex flex-col items-start justify-between gap-4 rounded-b-[32px] bg-[#f3f3f3] px-5 py-6 sm:flex-row sm:items-center sm:px-8">
            <p className="text-xs leading-4 tracking-[1.2px] text-stone-600 uppercase">
              Mostrando {matchingCustomers.length ? start + 1 : 0}–
              {start + visibleCustomers.length} de {matchingCustomers.length}{" "}
              clientes
            </p>
            <nav
              aria-label="Paginação de clientes"
              className="flex shrink-0 gap-2"
            >
              <button
                type="button"
                aria-label="Página anterior"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className={cn(pageButtonClassName, "border border-stone-300")}
              >
                <AdminPreviousIcon aria-hidden="true" />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1)
                .filter((item) => Math.abs(item - currentPage) <= 1)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Página ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                    onClick={() => setPage(item)}
                    className={cn(
                      pageButtonClassName,
                      item === currentPage &&
                        "text-admin-accent-ink bg-white shadow-xs",
                    )}
                  >
                    {item}
                  </button>
                ))}
              <button
                type="button"
                aria-label="Próxima página"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                className={cn(pageButtonClassName, "border border-stone-300")}
              >
                <AdminNextIcon aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>
      </div>
      {editor !== null && (
        <CustomerForm
          key={editor === "new" ? "new" : editor.id}
          customer={editor === "new" ? null : editor}
          onClose={() => setEditor(null)}
          onSave={saveCustomer}
        />
      )}
    </>
  );
}
