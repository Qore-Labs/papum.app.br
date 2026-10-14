import type { ReactNode } from "react";

export type DashboardOrderStatus = "in-transit" | "delivered" | "preparing";
export type DashboardPeriodId = "24h" | "7d" | "30d";

export interface DashboardAvatar {
  src: string;
  width: number;
  height: number;
  className: string;
}

export interface DashboardReportOrder {
  id: string;
  customer: string;
  status: DashboardOrderStatus;
  amount: number;
  time: string;
  ageInHours: number;
}

export interface DashboardOrder extends DashboardReportOrder {
  avatar: DashboardAvatar;
  rowClassName: string;
}

export interface DashboardOrderPresentation extends DashboardReportOrder {
  tableRow: ReactNode;
  mobileCard: ReactNode;
}
