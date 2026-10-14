# Configurações — Novo Estabelecimento

Operate. Estender o manager em `/dashboard/configuracoes`, grupo `(admin)`, fiel ao frame Figma `146:530`. Mundo existente, sem concept roll ou geração de imagens. O frame tem o header administrativo e sidebar, sem toolbar de busca.

Sequência: título e Novo Cadastro; informações do estabelecimento; dias e horários; endereço; dados bancários; ações; footer compartilhado. Quatro painéis brancos, ícones SVG originais em amarelo, inputs cinza, Inter/Jakarta e Arimo no painel bancário. Usar duas colunas nos campos apropriados em tablet/desktop e uma em celular; endereço usa grid de 12 colunas no desktop; dias permanecem tocáveis e quebram linha em telas estreitas.

Formulário frontend com RHF/Zod, erros em português, foco, teclado e confirmação local. Domingo e RS selecionados inicialmente como no Figma. Horários permitem funcionamento após meia-noite. Novo Cadastro limpa o formulário; Cancelar retorna ao dashboard. O botão de CEP verifica formato e orienta preenchimento manual na prévia, sem simular consulta externa. Dados permanecem na memória até recarregar, sem backend ou armazenamento de dados bancários.

Preservar assets e estrutura existentes, usar SVGs tipados, contraste nos campos e controles, respeitar movimento reduzido do drawer herdado. Conferir desktop, tablet e celulares, estados de erro, preenchimento, seleção, confirmação, reset e navegação; registrar origem e validação em `docs/design`.

## Encerramento

Concluído em 1280 × 900, 768 × 1024, 390 × 844 e 320 × 700, sem overflow horizontal. O formulário entregue tem 19 campos e sete dias controlados; Novo Cadastro restaura os padrões e foca o nome. Arimo permanece local ao painel bancário `217:1129`, e as cores de campo/amarelo estendem o sistema existente.

Passaram 100 testes em 15 arquivos, os seis testes do formulário após os ajustes finais, 22 checks de Playwright, ESLint, Prettier e build. O detector único não encontrou achados; o reviewer independente encerrou com `disposition: ship`, `persistence: pass` e nenhuma correção material pendente. Resultados, adaptações e limites em [settings-validation.md](../../docs/design/settings-validation.md); origem dos assets em [settings-assets.md](../../docs/design/settings-assets.md). `PRODUCT.md` e `DESIGN.md` permanecem incumbentes, sem migração de drift ou sidecar.
