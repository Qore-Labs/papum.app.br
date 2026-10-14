import type { Metadata } from "next";
import { Arimo } from "next/font/google";

import { EstablishmentForm } from "@/components/forms/establishment-form";
import {
  AdminAddressIcon,
  AdminBankCardsIcon,
  AdminClockIcon,
  AdminInformationIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";

const arimo = Arimo({ variable: "--font-arimo-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Novo Estabelecimento | ${siteConfig.name} Gestão`,
  description:
    "Cadastro de estabelecimento, horários, endereço e dados bancários no Pápum! Delivery.",
  alternates: { canonical: "/dashboard/configuracoes" },
};

const sections = [
  {
    id: "information",
    title: "Informações do Estabelecimento",
    icon: AdminInformationIcon,
  },
  { id: "hours", title: "Horário de Funcionamento", icon: AdminClockIcon },
  { id: "address", title: "Endereço Completo", icon: AdminAddressIcon },
  { id: "banking", title: "Dados Bancários", icon: AdminBankCardsIcon },
] as const;

export default function SettingsPage() {
  return (
    <main
      id="admin-main"
      data-admin-section="settings"
      tabIndex={-1}
      className={`${arimo.variable} bg-admin-surface min-w-0 outline-none`}
    >
      <EstablishmentForm
        heading={
          <div className="min-w-0 md:max-w-158">
            <h1 className="font-jakarta text-brand-ink text-[26px] leading-8 font-extrabold tracking-[-0.025em] sm:text-3xl sm:leading-9">
              Novo Estabelecimento
            </h1>
            <p className="mt-2 text-sm leading-5 text-stone-600">
              Adicione o seu restaurante à rede PáPum!. Preencha todos os dados
              técnicos e operacionais.
            </p>
          </div>
        }
        sectionHeadings={sections.map(({ id, title, icon: Icon }) => ({
          id,
          content: (
            <div className="flex min-h-10 items-center gap-3">
              <span className="bg-admin-yellow flex size-10 shrink-0 items-center justify-center rounded-lg text-white">
                <Icon aria-hidden="true" />
              </span>
              <h2
                id={`establishment-${id}-title`}
                className={`${id === "banking" ? "font-arimo" : "font-jakarta"} text-brand-ink text-lg leading-6 font-bold sm:text-xl sm:leading-7`}
              >
                {title}
              </h2>
            </div>
          ),
        }))}
      />
    </main>
  );
}
