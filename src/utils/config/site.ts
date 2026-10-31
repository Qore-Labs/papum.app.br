import type { MarketingCta } from "@/lib/analytics";

/**
 * Configuração global do site: identidade, metadados default e links externos.
 * Fonte única de verdade — consumido por `app/layout.tsx` (metadata),
 * header, footer e onde mais precisar dessas informações.
 */

export interface NavLink {
  href: string;
  label: string;
  openInNewTab?: boolean;
  analyticsCta?: MarketingCta;
}

export interface SiteSocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  tagline: string;
  url: string;
  navLinks: NavLink[];
  social: SiteSocialLinks;
}

export const siteConfig = {
  name: "Papum Delivery",
  title: "Papum Delivery - Gestão de Delivery",
  description:
    "App com a marca do seu restaurante e painel para organizar cardápio, pedidos e contatos. Conheça a proposta da Papum Delivery.",
  tagline: "Seu restaurante na frente. A Papum nos bastidores.",
  url: "https://www.papum.app.br",
  navLinks: [
    { href: "#produto", label: "Produto" },
    { href: "#como-funciona", label: "Como funciona" },
  ],
  social: {
    instagram: "https://www.instagram.com/usepapumdelivery/",
    facebook: "https://facebook.com",
    linkedin: "https://www.linkedin.com/company/binaryinc/",
  },
} satisfies SiteConfig;
