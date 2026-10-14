import type { ReactNode } from "react";

export type CustomerStatus = "vip" | "active" | "inactive";
export type CustomerFilterId = "all" | "recent" | "most-active";
export type CustomerAvatarId = "ana" | "ricardo" | "mariana" | "felipe";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  avatarId: CustomerAvatarId | null;
  lastOrder: string;
  lastOrderAgeInDays: number | null;
  totalSpent: number;
}

export interface CustomerAvatar {
  id: CustomerAvatarId;
  src: string;
}

export interface CustomerAvatarPresentation {
  id: CustomerAvatarId;
  image: ReactNode;
}

export interface CustomerFilter {
  id: CustomerFilterId;
  label: string;
}

export interface CustomerStatusPresentation {
  label: string;
  className: string;
}
