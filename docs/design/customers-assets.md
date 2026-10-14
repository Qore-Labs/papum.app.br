# Assets de Clientes

Origem: [Figma Pápum!, frame 146:85](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=146-85).

| Arquivo em `public/admin/customers` | Node      | Dimensões |
| ----------------------------------- | --------- | --------- |
| `ana-beatriz.png`                   | `146:234` | 80 × 80   |
| `ricardo-oliveira.png`              | `146:256` | 80 × 80   |
| `mariana-costa.png`                 | `146:278` | 80 × 80   |
| `felipe-mendes.png`                 | `146:300` | 80 × 80   |

Os arquivos originais foram baixados pelo fluxo indicado pelo MCP, sem alteração de pixels. O serviço entregou conteúdo JPEG sob nomes `.png`; o payload original foi preservado e `next/image` otimiza sua entrega. Os quatro avatares são exibidos em círculos de 40 × 40, inclusive nas linhas repetidas do Figma. Sua origem foi registrada em metadados; a verificação das quatro fotos e do avatar existente do gerente encontrou zero origens ausentes.

Os SVGs originais de Novo Cliente (`146:164`, 16,5 × 12), ações (`146:252`, 4 × 16), anterior (`146:325`, 4,31667 × 7) e próximo (`146:338`, 4,31667 × 7) foram convertidos em componentes tipados na biblioteca `src/components/ui/icons.tsx`, preservando caminhos e dimensões. A cor acompanha o controle para contraste.

Header, footer, logos SVG, avatar do gerente, busca, notificações, ajuda e ícones da navegação reutilizam os assets equivalentes existentes no admin. Novos clientes locais usam o ícone SVG de pessoa da biblioteca Lucide quando não há foto; não há upload nesta etapa.
