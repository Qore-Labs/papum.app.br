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
    "Papum Delivery está em pré-lançamento. Conheça a proposta para organizar o cardápio digital e os pedidos do seu restaurante e receba novidades.",
  tagline:
    "A revolução na forma de pedir comida. Rápido, fresco e direto na sua porta.",
  url: "https://www.papum.app.br",
  navLinks: [
    { href: "/", label: "Home" },
    {
      href: "/lancamento",
      label: "Planos",
      openInNewTab: true,
      analyticsCta: "plans",
    },
    // { href: "/servicos", label: "Serviços" },
  ],
  social: {
    // Perfil fictício para demonstração. Substituir quando houver Instagram oficial.
    instagram: "https://www.instagram.com/papum.delivery/",
    facebook: "https://facebook.com",
    linkedin: "https://www.linkedin.com/company/binaryinc/",
  },
} satisfies SiteConfig;
