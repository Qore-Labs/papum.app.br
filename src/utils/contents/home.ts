import type { ComponentType, SVGProps } from "react";

import {
  ScooterIcon,
  ShoppingBagIcon,
  UtensilsIcon,
} from "@/components/ui/icons";

export interface HomeProductIllustration {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
}

export interface HomeProductContent {
  headline: readonly string[];
  description: string;
  invitation: string;
  ctaLabel: string;
  illustrations: readonly HomeProductIllustration[];
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

export const HOME_PRODUCT_INTRO = {
  headline: ["A marca é sua.", "A estrutura é Pápum."],
  description:
    "Um app com a identidade do seu restaurante e um painel para organizar cardápio, pedidos e contatos.",
  invitation: "Cadastre seu e-mail para acompanhar o lançamento.",
  ctaLabel: "Quero ser avisado",
  illustrations: [
    {
      id: "pedidos",
      title: "Pedidos organizados",
      src: "/home/product/orders.svg",
      width: 340,
      height: 255,
    },
    {
      id: "contatos",
      title: "Contatos em um só lugar",
      src: "/home/product/contacts.svg",
      width: 340,
      height: 255,
    },
  ],
} satisfies HomeProductContent;

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
