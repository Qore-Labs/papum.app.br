# Assets do cadastro de estabelecimento

Origem: [Figma Pápum!, frame 146:530](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=146-530).

| Componente em `src/components/ui/icons.tsx` | Node                   | Dimensões originais                    |
| ------------------------------------------- | ---------------------- | -------------------------------------- |
| `AdminStoreAddIcon`                         | `146:600`              | 22 × 19                                |
| `AdminInformationIcon`                      | `146:607`              | 20 × 20                                |
| `AdminClockIcon`                            | `146:638`              | 20 × 20                                |
| `AdminAddressIcon`                          | `146:705`              | 16 × 20                                |
| `AdminPostalSearchIcon`                     | `146:717`              | 10,5 × 10,5                            |
| `AdminSelectArrowIcon`                      | `146:621`, `146:748`   | 21 × 21                                |
| `AdminCheckIcon`                            | `146:671`              | 20 × 20                                |
| `AdminBankCardsIcon`                        | `217:1134`, `217:1137` | máscara 20 × 20; vetor 19,85 × 20,0017 |
| `AdminBankSelectArrowIcon`                  | `217:1149`, `217:1158` | 9,975 × 5,775                          |
| `AdminSubmitArrowIcon`                      | `146:763`              | 16 × 16                                |

Os onze SVGs originais foram baixados pelo fluxo indicado pelo MCP e convertidos em componentes tipados, preservando caminhos e dimensões. O ícone bancário mantém a máscara alfa e o posicionamento do vetor dentro de 20 × 20. `currentColor` permite manter as cores decorativas do frame e ajustar contraste dos controles.

Logos SVG, avatar do gerente, navegação, suporte e footer reutilizam os assets equivalentes existentes no admin. Nenhum raster novo foi criado; o scan de origem encontrou um raster e nenhuma origem ausente. O horário usa o seletor nativo do navegador; os SVGs sem conteúdo desses controles no Figma não constituem imagens visíveis.

O painel bancário usa Arimo, conforme o design context de `217:1129`; essa fonte permanece local ao painel. Os demais títulos usam Jakarta, os controles Inter e o footer Be Vietnam Pro.
