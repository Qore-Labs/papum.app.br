import type { HTMLInputAutoCompleteAttribute, ReactNode } from "react";

export type EstablishmentFieldId =
  | "name"
  | "cuisine"
  | "phone"
  | "cnpj"
  | "openingTime"
  | "closingTime"
  | "postalCode"
  | "street"
  | "number"
  | "complement"
  | "district"
  | "city"
  | "state"
  | "bank"
  | "accountType"
  | "agency"
  | "accountNumber"
  | "holderName"
  | "holderDocument";
export type EstablishmentDayId =
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface EstablishmentOption {
  value: string;
  label: string;
}
export interface EstablishmentDay {
  id: EstablishmentDayId;
  label: string;
  fullName: string;
}
export interface EstablishmentField {
  id: EstablishmentFieldId;
  label: string;
  kind: "text" | "select" | "time" | "postal";
  placeholder?: string;
  type?: "text" | "tel";
  autoComplete?: HTMLInputAutoCompleteAttribute;
  inputMode?: "numeric" | "tel";
  maxLength?: number;
  optional?: boolean;
  className?: string;
  options?: readonly EstablishmentOption[];
}

export interface EstablishmentSectionHeading {
  id: "information" | "hours" | "address" | "banking";
  content: ReactNode;
}
