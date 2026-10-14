import type { ReactNode } from "react";

export type MenuCategoryId = "hamburgers" | "pizzas" | "pokes" | "drinks";
export type MenuFilterId = "all" | MenuCategoryId;
export type MenuPhotoId =
  | "classic-burger"
  | "bacon-blast"
  | "biggie-delight"
  | "classic-pizza"
  | "calabresa-irada"
  | "veggie-delight"
  | "poke";

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
  heading: string;
}

export interface MenuFilter {
  id: MenuFilterId;
  label: string;
}

export interface MenuPhoto {
  id: MenuPhotoId;
  label: string;
  src: string;
  width: number;
  height: number;
  className: string;
  sizes: string;
}

export interface MenuPhotoPresentation {
  id: MenuPhotoId;
  label: string;
  image: ReactNode;
}

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategoryId;
  photoId: MenuPhotoId | null;
  active: boolean;
  topSeller: boolean;
}
