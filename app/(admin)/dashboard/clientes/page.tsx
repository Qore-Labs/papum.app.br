import type { Metadata } from "next";
import Image from "next/image";

import { CustomersWorkspace } from "@/components/dashboard/customers-workspace";
import { AdminToolbarActions } from "@/components/layout/admin-toolbar";
import { AdminPopover } from "@/components/ui/admin-popover";
import { siteConfig } from "@/utils/config/site";
import {
  CUSTOMER_AVATARS,
  CUSTOMER_DEMO_DATA,
} from "@/utils/contents/customers";

export const metadata: Metadata = {
  title: `Clientes | ${siteConfig.name} Gestão`,
  description: "Gestão da base de clientes do Pápum! Delivery.",
  alternates: { canonical: "/dashboard/clientes" },
};

export default function CustomersPage() {
  return (
    <main
      id="admin-main"
      data-admin-section="customers"
      tabIndex={-1}
      className="bg-admin-surface min-w-0 outline-none"
    >
      <CustomersWorkspace
        initialCustomers={CUSTOMER_DEMO_DATA}
        heading={
          <div className="min-w-0">
            <h1 className="font-jakarta text-[28px] leading-9 font-bold tracking-[-0.025em] text-stone-900 sm:text-4xl sm:leading-10">
              Base de Clientes
            </h1>
            <p className="mt-2 text-base leading-6 text-stone-600">
              Gerencie e analise o comportamento de compra dos seus clientes
              recorrentes.
            </p>
          </div>
        }
        toolbarActions={
          <AdminToolbarActions
            helpId="customers-toolbar-help"
            indicatorClassName="bg-admin-accent-ink"
            help={
              <AdminPopover
                id="customers-toolbar-help"
                title="Ajuda dos clientes"
              >
                <p>
                  Busque por nome, e-mail ou telefone. Recentes mostra quem
                  pediu nas últimas 48 horas. Mais Ativos ordena clientes ativos
                  e VIP pelo total gasto.
                </p>
                <p className="mt-2">
                  Use Novo Cliente ou as ações de cada linha para testar
                  cadastro, edição e status. Os dados são exemplos do Figma; as
                  alterações duram até recarregar a página.
                </p>
              </AdminPopover>
            }
          />
        }
        avatars={CUSTOMER_AVATARS.map((avatar) => ({
          id: avatar.id,
          image: (
            <Image
              key={avatar.id}
              src={avatar.src}
              alt=""
              width={80}
              height={80}
              sizes="40px"
              className="size-10 object-cover"
            />
          ),
        }))}
      />
    </main>
  );
}
