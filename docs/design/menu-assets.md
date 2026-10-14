# Assets do Cardápio

Origem: [Figma Pápum!, frame 31:737](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=31-737).

| Arquivo em `public/admin/menu` | Node                            | Dimensões originais |
| ------------------------------ | ------------------------------- | ------------------- |
| `classic-burger.png`           | `32:1517`                       | 512 × 512           |
| `bacon-blast.png`              | `32:1539`                       | 1024 × 1024         |
| `biggie-delight.png`           | `32:1558`                       | 1024 × 1024         |
| `classic-pizza.png`            | `32:1785`                       | 1024 × 1024         |
| `calabresa-irada.png`          | `32:1910`                       | 1024 × 1024         |
| `veggie-delight.png`           | `32:1912`                       | 1024 × 1024         |
| `poke.png`                     | `32:1852`, `32:1914`, `32:1916` | 1024 × 1024         |

Os PNGs originais foram baixados conforme as instruções do MCP, sem alteração dos pixels. As sete fotos receberam metadados de origem; o avatar existente do gerente também teve sua proveniência registrada. A verificação dos oito rasters usados por esta superfície encontrou zero origens faltantes. A mesma foto é usada nos três pokes porque assim aparece no Figma. O design context determina os recortes, mantidos pela implementação; `next/image` otimiza a entrega.

Os SVGs de adicionar (`32:1415`, 8,16667 × 8,16667) e editar (`32:1535`, 10,5 × 10,5) foram convertidos em componentes tipados na biblioteca `src/components/ui/icons.tsx`. As logos, o avatar do gerente e os demais ícones reutilizam os assets equivalentes do admin existente.

Novos itens da prévia podem usar uma dessas fotos ou o placeholder explicitamente identificado como “Sem imagem”. Não há upload nem persistência nesta etapa.
