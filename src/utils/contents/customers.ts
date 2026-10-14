import type {
  Customer,
  CustomerAvatar,
  CustomerFilter,
  CustomerStatus,
  CustomerStatusPresentation,
} from "@/types/customers";

export const CUSTOMERS_PAGE_SIZE = 7;

export const CUSTOMER_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "recent", label: "Recentes" },
  { id: "most-active", label: "Mais Ativos" },
] satisfies readonly CustomerFilter[];

export const CUSTOMER_STATUSES = {
  vip: { label: "VIP", className: "bg-[#ffbb00] text-red-800" },
  active: { label: "Ativo", className: "bg-emerald-50 text-emerald-700" },
  inactive: { label: "Inativo", className: "bg-stone-100 text-stone-600" },
} satisfies Record<CustomerStatus, CustomerStatusPresentation>;

export const CUSTOMER_AVATARS = [
  { id: "ana", src: "/admin/customers/ana-beatriz.png" },
  { id: "ricardo", src: "/admin/customers/ricardo-oliveira.png" },
  { id: "mariana", src: "/admin/customers/mariana-costa.png" },
  { id: "felipe", src: "/admin/customers/felipe-mendes.png" },
] satisfies readonly CustomerAvatar[];

const ana: Omit<Customer, "id"> = {
  name: "Ana Beatriz Silva",
  email: "ana.beatriz@email.com",
  phone: "(11) 98765-4321",
  status: "vip",
  avatarId: "ana",
  lastOrder: "Hoje, 12:45",
  lastOrderAgeInDays: 0,
  totalSpent: 1250.2,
};
const ricardo: Omit<Customer, "id"> = {
  name: "Ricardo Oliveira",
  email: "ricardo.oliveira@email.com",
  phone: "(11) 98765-4321",
  status: "active",
  avatarId: "ricardo",
  lastOrder: "Ontem, 20:15",
  lastOrderAgeInDays: 1,
  totalSpent: 450.2,
};
const mariana: Omit<Customer, "id"> = {
  name: "Mariana Costa",
  email: "mariana.c@email.com",
  phone: "(11) 98765-4321",
  status: "inactive",
  avatarId: "mariana",
  lastOrder: "Há 15 dias",
  lastOrderAgeInDays: 15,
  totalSpent: 89.9,
};
const felipe: Omit<Customer, "id"> = {
  name: "Felipe Mendes",
  email: "fmendes@email.com",
  phone: "(11) 98765-4321",
  status: "active",
  avatarId: "felipe",
  lastOrder: "Ontem, 19:30",
  lastOrderAgeInDays: 1,
  totalSpent: 215,
};

// As sete linhas (incluindo repetições) reproduzem a prévia do frame 146:85.
export const CUSTOMER_DEMO_DATA = [
  { id: "customer-1", ...ana },
  { id: "customer-2", ...ricardo },
  { id: "customer-3", ...mariana },
  { id: "customer-4", ...felipe },
  { id: "customer-5", ...ana },
  { id: "customer-6", ...ricardo },
  { id: "customer-7", ...mariana },
] satisfies readonly Customer[];
