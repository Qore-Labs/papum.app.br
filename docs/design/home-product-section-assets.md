# Assets da seção de produto da Home

Origem: arquivo Figma da Papum fornecido pelo usuário, [Posts redes sociais](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/Papum-%7C-Posts-redes-sociais?node-id=0-1). Downloads realizados em 30/10/2026 pelo MCP do Figma, preservando os SVGs originais, sem reescrever paths ou alterar as dimensões internas.

| Arquivo local                       | Fonte no Figma                                                | Dimensões originais | Bytes | SHA-256                                                            |
| ----------------------------------- | ------------------------------------------------------------- | ------------------- | ----- | ------------------------------------------------------------------ |
| `public/home/product/orders.svg`    | Frame `30:397`, camada `30:445`, recibo e sacola              | 340 × 255           | 3269  | `fd4d934f1868e495e31fcbc7e9e045af32b31c4f0a4e8c910537e62fb7cdb4ed` |
| `public/home/product/contacts.svg`  | Frame `30:397`, camada `30:468`, perfis e cartões de contatos | 340 × 255           | 3857  | `17224804155256df83c547d400098407bd73704d3b0323facf88f94044f68ae4` |
| `public/home/product/lightning.svg` | Frame `30:22`, camada `30:24`, raio                           | 720 × 720           | 1496  | `26b47dcdda2450f8756eb2916bf808b80d03696c104dd44c85aaf6111ace76ff` |

Uso: `src/components/home/product-intro-section.tsx`. Recibo/sacola e contatos acompanham suas respectivas legendas; a proporção 4:3 é preservada. O raio mantém proporção quadrada, com rotação, opacidade e recorte do wrapper para adaptar a assinatura gráfica à nova composição aprovada.

As ilustrações são decorativas junto das legendas equivalentes e usam texto alternativo vazio. Não há fotografias nem marca de restaurante nessa seção. Nenhum URL temporário de asset do Figma é utilizado em runtime.

A captura do post para comparação está em `output/playwright/product-section/reference-post-04.png`, ignorada pelo Git. Ela serve apenas como evidência de origem visual; não é usada como imagem da página.
