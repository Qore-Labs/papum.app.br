import type { ComponentType, SVGProps } from "react";

import { AtIcon, CommunityIcon, GlobeIcon } from "@/components/ui/icons";
import { siteConfig, type NavLink } from "@/utils/config/site";

export type FooterLink = NavLink;

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterSocialLink extends FooterLink {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
}

/**
 * Conteúdo estático do footer — não vem da API.
 * Centralizado aqui para manutenção simples; o componente só renderiza.
 */
export const FOOTER_COLUMNS = [
  {
    id: "explore",
    title: "EXPLORE",
    links: [
      {
        href: "/lancamento",
        label: "Planos",
        openInNewTab: true,
        analyticsCta: "plans",
      },
    ],
  },
  {
    id: "suporte",
    title: "SUPORTE",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/termos-de-uso", label: "Termos de Uso" },
      { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    ],
  },
] satisfies FooterColumn[];

export const FOOTER_SOCIAL_LINKS = [
  {
    id: "linkedin",
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    icon: GlobeIcon,
    iconClassName: "size-3",
  },
  {
    id: "facebook",
    href: siteConfig.social.facebook,
    label: "Facebook",
    icon: CommunityIcon,
    iconClassName: "h-2 w-3.5",
  },
  {
    id: "instagram",
    href: siteConfig.social.instagram,
    label: "Instagram",
    icon: AtIcon,
    iconClassName: "size-3",
  },
] satisfies FooterSocialLink[];

export const FOOTER_LEGAL = {
  madeWith: "Feito com paixão pela culinária.",
};
