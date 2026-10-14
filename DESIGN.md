# Direção visual existente

- O Figma fornecido pelo usuário é a referência para cada tela; preservar a identidade já implementada no site e no login.
- Logos e ícones ficam na biblioteca SVG `src/components/ui/icons.tsx`.
- O dashboard mantém o header laranja, superfícies neutras claras, sidebar, banner do restaurante e tabela de pedidos do frame `27:3`.
- Usar Inter nos controles e dados administrativos, Plus Jakarta Sans nos títulos e Be Vietnam Pro no footer compartilhado.
- No desktop, preservar medidas e alinhamentos do frame. Abaixo de 1024 px, usar o drawer de navegação; abaixo de 768 px, apresentar os pedidos como cards legíveis. O tablet a partir de 768 px mantém a tabela.
- Menus e controles têm teclado, foco visível, estados acessíveis e alvos de toque adequados. O movimento deve ser sutil, responder à ação e respeitar `prefers-reduced-motion`.
- Ajustar contraste de textos pequenos quando necessário para acessibilidade.

Referência do dashboard: https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=27-3
