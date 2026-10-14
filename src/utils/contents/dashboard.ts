import type { ComponentType, SVGProps } from "react";

import {
  AdminCustomersIcon,
  AdminMenuIcon,
  AdminOrdersIcon,
  AdminSettingsIcon,
} from "@/components/ui/icons";
import type {
  DashboardOrder,
  DashboardOrderStatus,
  DashboardPeriodId,
} from "@/types/dashboard";

interface DashboardNavItem {
  id: string;
  label: string;
  href: string;
  available: boolean;
  offset: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface DashboardPeriod {
  id: DashboardPeriodId;
  label: string;
  hours: number;
}

interface OrderStatusPresentation {
  label: string;
  className: string;
}

export const DASHBOARD_NAV_ITEMS = [
  {
    id: "orders",
    label: "Pedidos",
    href: "/dashboard",
    available: true,
    offset: true,
    icon: AdminOrdersIcon,
  },
  {
    id: "menu",
    label: "Cardápio",
    href: "/dashboard/cardapio",
    available: true,
    offset: false,
    icon: AdminMenuIcon,
  },
  {
    id: "customers",
    label: "Clientes",
    href: "/dashboard/clientes",
    available: true,
    offset: false,
    icon: AdminCustomersIcon,
  },
  {
    id: "settings",
    label: "Configurações",
    href: "/dashboard/configuracoes",
    available: true,
    offset: false,
    icon: AdminSettingsIcon,
  },
] satisfies readonly DashboardNavItem[];

export const DASHBOARD_PERIODS = [
  { id: "24h", label: "Últimas 24 Horas", hours: 24 },
  { id: "7d", label: "Últimos 7 Dias", hours: 168 },
  { id: "30d", label: "Últimos 30 Dias", hours: 720 },
] satisfies readonly DashboardPeriod[];

export const DASHBOARD_ORDER_STATUSES = {
  "in-transit": {
    label: "EM TRANSITO",
    className: "bg-home-orange/20 text-[#9a4600]",
  },
  delivered: { label: "ENTREGUE", className: "bg-green-100 text-green-700" },
  preparing: { label: "PREPARANDO", className: "bg-stone-100 text-stone-600" },
} satisfies Record<DashboardOrderStatus, OrderStatusPresentation>;

export const DASHBOARD_MANAGER = {
  name: "Marcus V.",
  role: "GERENTE",
  avatar: "/admin/dashboard/manager-avatar.png",
};

// Dados de demonstração do frame 27:3. A integração substituirá esta lista.
export const DASHBOARD_DEMO_ORDERS = [
  {
    id: "KD-9281",
    customer: "Alice Silva",
    status: "in-transit",
    amount: 142.5,
    time: "12:45 PM",
    ageInHours: 1,
    avatar: {
      src: "/admin/dashboard/alice-silva.png",
      width: 320,
      height: 480,
      className: "h-full w-full object-cover",
    },
    rowClassName: "h-19.25",
  },
  {
    id: "KD-9280",
    customer: "João Diniz",
    status: "delivered",
    amount: 89,
    time: "12:30 PM",
    ageInHours: 1.25,
    avatar: {
      src: "/admin/dashboard/joao-diniz.png",
      width: 319,
      height: 479,
      className:
        "absolute top-[0.71%] left-0 h-[150.16%] w-full max-w-none object-fill",
    },
    rowClassName: "h-17.5",
  },
  {
    id: "KD-9279",
    customer: "Carla Reys",
    status: "preparing",
    amount: 210.3,
    time: "12:45 PM",
    ageInHours: 1,
    avatar: {
      src: "/admin/dashboard/carla-reys.png",
      width: 320,
      height: 480,
      className:
        "absolute -top-[2.75%] left-0 h-[144.56%] w-full max-w-none object-fill",
    },
    rowClassName: "h-19.75",
  },
  {
    id: "KD-9278",
    customer: "Tânia M.",
    status: "preparing",
    amount: 235.5,
    time: "12:45 PM",
    ageInHours: 1,
    avatar: {
      src: "/admin/dashboard/tania.png",
      width: 383,
      height: 479,
      className: "h-full w-full object-cover",
    },
    rowClassName: "h-20",
  },
] satisfies readonly DashboardOrder[];
