import type { ComponentType, SVGProps } from "react";

import { AtIcon, CommunityIcon, GlobeIcon } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";

interface FooterLink {
  href: string;
  label: string;
}

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
    id: "papum",
    title: "PÁPUM!",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/como-funciona", label: "Como Funciona" },
      { href: "/parceiros", label: "Parceiros" },
    ],
  },
  {
    id: "explore",
    title: "EXPLORE",
    links: [
      { href: "/planos", label: "Planos" },
      { href: "/servicos", label: "Serviços" },
      { href: "/promocoes", label: "Promoções" },
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
