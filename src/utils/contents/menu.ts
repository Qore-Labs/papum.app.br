import type {
  MenuCategory,
  MenuFilter,
  MenuPhoto,
  MenuProduct,
} from "@/types/menu";

export const MENU_CATEGORIES = [
  { id: "hamburgers", label: "Hambúrguers", heading: "Hamburguers" },
  { id: "pizzas", label: "Pizzas", heading: "Pizzas" },
  { id: "pokes", label: "Pokes", heading: "Pokes" },
  { id: "drinks", label: "Bebidas", heading: "Bebidas" },
] satisfies readonly MenuCategory[];

export const MENU_FILTERS = [
  { id: "all", label: "Todos" },
  ...MENU_CATEGORIES,
] satisfies readonly MenuFilter[];

const baseImageSizes =
  "(min-width: 1280px) calc((100vw - 470px) / 3), (min-width: 1024px) calc((100vw - 412px) / 2), (min-width: 640px) calc((100vw - 156px) / 2), calc(100vw - 66px)";

const pizzaPhotos = [
  { id: "classic-pizza", label: "Classic Pizza" },
  { id: "calabresa-irada", label: "Calabresa Irada" },
  { id: "veggie-delight", label: "Veggie Delight" },
] satisfies readonly Pick<MenuPhoto, "id" | "label">[];

export const MENU_PHOTOS = [
  {
    id: "classic-burger",
    label: "Classic Burger",
    src: "/admin/menu/classic-burger.png",
    width: 512,
    height: 512,
    className:
      "absolute -top-[20.31%] left-0 h-[140.62%] w-full max-w-none object-fill",
    sizes: baseImageSizes,
  },
  {
    id: "bacon-blast",
    label: "Bacon Blast",
    src: "/admin/menu/bacon-blast.png",
    width: 1024,
    height: 1024,
    className:
      "absolute -top-[53.37%] -left-[10.28%] h-[169.27%] w-[120.37%] max-w-none object-fill",
    sizes:
      "(min-width: 1280px) calc((100vw - 470px) * 0.402), (min-width: 1024px) calc((100vw - 412px) * 0.602), (min-width: 640px) calc((100vw - 156px) * 0.602), calc((100vw - 66px) * 1.204)",
  },
  {
    id: "biggie-delight",
    label: "Biggie Delight",
    src: "/admin/menu/biggie-delight.png",
    width: 1024,
    height: 1024,
    className:
      "absolute -top-[20.31%] left-0 h-[140.62%] w-full max-w-none object-fill",
    sizes: baseImageSizes,
  },
  ...pizzaPhotos.map(({ id, label }) => ({
    id,
    label,
    src: `/admin/menu/${id}.png`,
    width: 1024,
    height: 1024,
    className:
      "absolute -top-[107.11%] -left-[24.44%] h-[209.37%] w-[148.89%] max-w-none object-fill",
    sizes:
      "(min-width: 1280px) calc((100vw - 470px) * 0.497), (min-width: 1024px) calc((100vw - 412px) * 0.745), (min-width: 640px) calc((100vw - 156px) * 0.745), calc((100vw - 66px) * 1.489)",
  })),
  {
    id: "poke",
    label: "Poke",
    src: "/admin/menu/poke.png",
    width: 1024,
    height: 1024,
    className:
      "absolute -top-[87.55%] -left-[36.04%] h-[201.04%] w-[142.96%] max-w-none object-fill",
    sizes:
      "(min-width: 1280px) calc((100vw - 470px) * 0.477), (min-width: 1024px) calc((100vw - 412px) * 0.715), (min-width: 640px) calc((100vw - 156px) * 0.715), calc((100vw - 66px) * 1.430)",
  },
] satisfies readonly MenuPhoto[];

const classicDescription =
  "Carne Angus 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial Kinetic.";
const baconDescription =
  "O paraíso dos amantes de bacon. Três fatias de bacon caramelizado e maionese defumada.";
const veggieDescription =
  "Hambúrguer de grão de bico artesanal, avocado, brotos orgânicos e pão multigrãos.";

// Produtos e textos de demonstração do frame 31:737, ainda sem persistência.
export const MENU_DEMO_PRODUCTS = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: classicDescription,
    price: 34.9,
    category: "hamburgers",
    photoId: "classic-burger",
    active: true,
    topSeller: true,
  },
  {
    id: "bacon-blast",
    name: "Bacon Blast",
    description: baconDescription,
    price: 42.9,
    category: "hamburgers",
    photoId: "bacon-blast",
    active: true,
    topSeller: false,
  },
  {
    id: "biggie-delight",
    name: "Biggie Delight",
    description: veggieDescription,
    price: 58.9,
    category: "hamburgers",
    photoId: "biggie-delight",
    active: true,
    topSeller: false,
  },
  {
    id: "classic-pizza",
    name: "Classic Pizza",
    description: classicDescription,
    price: 34.9,
    category: "pizzas",
    photoId: "classic-pizza",
    active: true,
    topSeller: true,
  },
  {
    id: "calabresa-irada",
    name: "Calabresa Irada",
    description: baconDescription,
    price: 42.9,
    category: "pizzas",
    photoId: "calabresa-irada",
    active: true,
    topSeller: false,
  },
  {
    id: "veggie-delight",
    name: "Veggie Delight",
    description: veggieDescription,
    price: 38.9,
    category: "pizzas",
    photoId: "veggie-delight",
    active: true,
    topSeller: false,
  },
  {
    id: "poke-1",
    name: "Poke1",
    description: classicDescription,
    price: 34.9,
    category: "pokes",
    photoId: "poke",
    active: true,
    topSeller: true,
  },
  {
    id: "poke-2",
    name: "Poke2",
    description: baconDescription,
    price: 42.9,
    category: "pokes",
    photoId: "poke",
    active: true,
    topSeller: false,
  },
  {
    id: "poke-3",
    name: "Poke3",
    description: veggieDescription,
    price: 38.9,
    category: "pokes",
    photoId: "poke",
    active: true,
    topSeller: false,
  },
] satisfies readonly MenuProduct[];
