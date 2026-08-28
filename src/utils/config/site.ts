/**
 * Configuração global do site: identidade, metadados default e links externos.
 * Fonte única de verdade — consumido por `app/layout.tsx` (metadata),
 * header, footer e onde mais precisar dessas informações.
 */

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  tagline: string;
  url: string;
  navLinks: NavLink[];
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export const siteConfig = {
  name: "Pápum!",
  title: "Pápum! | Seu delivery tá no ar",
  description:
    "Monte seu cardápio virtual em minutos. Simples, rápido e sem complicação — o seu delivery na velocidade que você precisa.",
  tagline:
    "A revolução na forma de pedir comida. Rápido, fresco e direto na sua porta.",
  url: "https://papum.app.br",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/planos", label: "Planos" },
    { href: "/servicos", label: "Serviços" },
  ],
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
} satisfies SiteConfig;
