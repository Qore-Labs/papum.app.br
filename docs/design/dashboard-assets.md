# Assets do dashboard

Origem: [Figma Pápum!, frame 27:3](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=27-3).

| Arquivo                                        | Node     | Dimensões originais |
| ---------------------------------------------- | -------- | ------------------- |
| `public/admin/dashboard/restaurant-banner.png` | `30:708` | 2064 × 512          |
| `public/admin/dashboard/manager-avatar.png`    | `30:686` | 480 × 320           |
| `public/admin/dashboard/alice-silva.png`       | `28:380` | 320 × 480           |
| `public/admin/dashboard/joao-diniz.png`        | `28:397` | 319 × 479           |
| `public/admin/dashboard/carla-reys.png`        | `28:413` | 320 × 480           |
| `public/admin/dashboard/tania.png`             | `29:577` | 383 × 479           |

Os PNGs foram baixados do MCP sem edição. O banner e os avatares mantêm os recortes descritos pelo design context. A otimização de entrega é feita por `next/image`.

Os ícones administrativos foram convertidos dos SVGs do Figma em componentes tipados em `src/components/ui/icons.tsx`, preservando paths, viewBox e dimensões. As logos do header e footer reutilizam o SVG existente do projeto.
