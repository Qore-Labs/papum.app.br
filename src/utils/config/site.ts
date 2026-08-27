/**
 * Configuração global do site: identidade, metadados default e links externos.
 * Fonte única de verdade — consumido por `app/layout.tsx` (metadata),
 * footer, header e onde mais precisar dessas informações.
 */
export const siteConfig = {
  name: "Pápum!",
  title: "Pápum! | Seu delivery tá no ar",
  description:
    "Monte seu cardápio virtual em minutos. Simples, rápido e sem complicação — o seu delivery na velocidade que você precisa.",
  tagline:
    "A revolução na forma de pedir comida. Rápido, fresco e direto na sua porta.",
  url: "https://papum.app.br",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
