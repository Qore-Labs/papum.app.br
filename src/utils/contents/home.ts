import type { ComponentType, SVGProps } from "react";

import {
  ScooterIcon,
  ShoppingBagIcon,
  UtensilsIcon,
} from "@/components/ui/icons";

export interface PartnerBrand {
  id: string;
  first: string;
  second?: string;
  secondColor?: string;
  underline?: boolean;
  widthClass: string;
}

export interface HowItWorksStep {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface AppStat {
  id: string;
  value: string;
  label: string;
  star?: boolean;
}

export const PARTNER_BRANDS = [
  {
    id: "burger-king",
    first: "BURGER",
    second: "KING",
    secondColor: "text-home-red",
    widthClass: "xl:w-[174px]",
  },
  {
    id: "sushi-zen",
    first: "SUSHI",
    second: "ZEN",
    secondColor: "text-home-orange",
    widthClass: "xl:w-[137px]",
  },
  {
    id: "pizza-hut",
    first: "PIZZA",
    second: "HUT",
    secondColor: "text-home-red",
    widthClass: "xl:w-[127px]",
  },
  {
    id: "subway",
    first: "SUB",
    second: "WAY",
    secondColor: "text-home-orange",
    widthClass: "xl:w-[121px]",
  },
  {
    id: "giraffas",
    first: "GIRAFFAS",
    underline: true,
    widthClass: "xl:w-[145px]",
  },
] satisfies PartnerBrand[];

export const HOW_IT_WORKS_STEPS = [
  {
    id: "cardapio",
    icon: UtensilsIcon,
    title: "1. Crie seu cardápio",
    description:
      "Crie e personalize o seu cardápio virtual de maneira rápida e fácil",
  },
  {
    id: "plano",
    icon: ShoppingBagIcon,
    title: "2. Escolha um plano",
    description: "Escolha o melhor plano de atendimento para seu restaurante",
  },
  {
    id: "venda",
    icon: ScooterIcon,
    title: "3. Venda",
    description: "Venda, acompanhe e organize seu movimento de caixa",
  },
] satisfies HowItWorksStep[];

export const APP_STATS = [
  { id: "restaurantes", value: "+500", label: "Restaurantes" },
  { id: "pedidos", value: "+50k", label: "Pedidos/Mês" },
  { id: "avaliacao", value: "4.9", label: "Avaliação Média", star: true },
  { id: "entrega", value: "15 min", label: "Entrega Média" },
] satisfies AppStat[];

export const TESTIMONIAL_STARS = [1, 2, 3, 4, 5] as const;
