import type { Metadata } from "next";
import Image from "next/image";

import { MenuWorkspace } from "@/components/dashboard/menu-workspace";
import { AdminToolbarActions } from "@/components/layout/admin-toolbar";
import { AdminPopover } from "@/components/ui/admin-popover";
import { siteConfig } from "@/utils/config/site";
import { MENU_DEMO_PRODUCTS, MENU_PHOTOS } from "@/utils/contents/menu";

export const metadata: Metadata = {
  title: `Cardápio | ${siteConfig.name} Gestão`,
  description:
    "Gestão de produtos, categorias e disponibilidade do cardápio do Pápum! Delivery.",
  alternates: { canonical: "/dashboard/cardapio" },
};

export default function MenuPage() {
  return (
    <main
      id="admin-main"
      data-admin-section="menu"
      tabIndex={-1}
      className="min-w-0 bg-white outline-none"
    >
      <MenuWorkspace
        initialProducts={MENU_DEMO_PRODUCTS}
        heading={
          <div className="max-w-128 min-w-0 md:max-w-113.5">
            <h1 className="font-jakarta text-brand-ink text-[26px] leading-8 font-extrabold sm:text-3xl sm:leading-9">
              Gestão de Cardápio
            </h1>
            <p className="text-admin-description mt-2 text-base leading-6">
              Crie, edite e organize seus produtos com precisão para uma melhor
              experiência de entrega.
            </p>
          </div>
        }
        toolbarActions={
          <AdminToolbarActions
            helpId="menu-toolbar-help"
            indicatorClassName="bg-admin-accent-ink"
            help={
              <AdminPopover id="menu-toolbar-help" title="Ajuda do cardápio">
                <p>
                  Busque um prato pelo nome, filtre por categoria e altere sua
                  disponibilidade.
                </p>
                <p className="mt-2">
                  Use Novo Item ou Editar para testar os formulários. Produtos e
                  imagens são exemplos do Figma; as alterações ficam disponíveis
                  até recarregar a página.
                </p>
              </AdminPopover>
            }
          />
        }
        photos={MENU_PHOTOS.map((photo) => ({
          id: photo.id,
          label: photo.label,
          image: (
            <Image
              key={photo.id}
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes={photo.sizes}
              fetchPriority={photo.id === "classic-burger" ? "high" : undefined}
              loading={photo.id === "classic-burger" ? "eager" : "lazy"}
              className={photo.className}
            />
          ),
        }))}
      />
    </main>
  );
}
