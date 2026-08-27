import { AtIcon, CommunityIcon, GlobeIcon } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";

/**
 * Conteúdo estático do footer — não vem da API.
 * Centralizado aqui para manutenção simples; o componente só renderiza.
 */
export const FOOTER_COLUMNS = [
  {
    title: "PÁPUM!",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/como-funciona", label: "Como Funciona" },
      { href: "/parceiros", label: "Parceiros" },
    ],
  },
  {
    title: "EXPLORE",
    links: [
      { href: "/planos", label: "Planos" },
      { href: "/servicos", label: "Serviços" },
      { href: "/promocoes", label: "Promoções" },
    ],
  },
  {
    title: "SUPORTE",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/termos-de-uso", label: "Termos de Uso" },
      { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS = [
  { href: siteConfig.social.instagram, label: "Instagram", icon: AtIcon },
  { href: siteConfig.social.facebook, label: "Facebook", icon: CommunityIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: GlobeIcon },
];

export const FOOTER_LEGAL = {
  copyright: "© 2026 PáPum! Delivery. All rights reserved.",
  madeWith: "Feito com carinho para os melhores restaurantes.",
};
