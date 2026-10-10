export interface LaunchStat {
  id: string;
  value: string;
  label: string;
}

export const LAUNCH_STATS = [
  { id: "restaurants", value: "+500", label: "Restaurantes na fila" },
  { id: "orders", value: "+50k", label: "Pedidos esperados/mês" },
  { id: "delivery", value: "15 min", label: "Entrega média prevista" },
] satisfies readonly LaunchStat[];
