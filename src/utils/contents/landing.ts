import { BookOpen, ClipboardList, Users, type LucideIcon } from "lucide-react";

export interface ProductFeature {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  image?: string;
}

export const PRODUCT_FEATURES: readonly ProductFeature[] = [
  {
    id: "cardapio",
    label: "Cardápio",
    icon: BookOpen,
    title: "Seu cardápio, com a sua cara.",
    description:
      "Produtos e categorias em uma experiência com a identidade do seu restaurante.",
    detail:
      "Uma apresentação que ajuda seu cliente a encontrar o próximo pedido.",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    icon: ClipboardList,
    title: "Cada pedido no seu lugar.",
    description:
      "Um painel para visualizar os pedidos e acompanhar as etapas da operação.",
    detail:
      "Mais clareza para entender o que chegou e o que precisa de atenção.",
    image: "/home/product/orders.svg",
  },
  {
    id: "contatos",
    label: "Contatos",
    icon: Users,
    title: "Mais perto de quem pede.",
    description:
      "Contatos e informações organizados para conhecer melhor quem chega até você.",
    detail: "O relacionamento com o cliente também faz parte do seu delivery.",
    image: "/home/product/contacts.svg",
  },
];

export const LANDING_FAQ = [
  {
    id: "marca",
    question: "O app é personalizável com a minha marca?",
    answer:
      "Sim. Nome, logo e cores do seu restaurante fazem parte da experiência. A Papum oferece a tecnologia e o painel de gestão para que a sua marca fique em destaque.",
  },
  {
    id: "publico",
    question: "Para quem é a Papum?",
    answer:
      "Para restaurantes e negócios de alimentação que querem um app com a própria marca e mais organização para o delivery, reunindo cardápio, pedidos e contatos.",
  },
  {
    id: "cadastro",
    question: "O que acontece depois do cadastro?",
    answer:
      "Enviamos uma confirmação para o seu e-mail. Por lá, você recebe informações sobre a Papum e sobre quando poderá começar a usar a plataforma.",
  },
  {
    id: "cobranca",
    question: "Preciso pagar para me cadastrar?",
    answer:
      "Não. Deixar seu e-mail é gratuito e não gera cobrança nem contratação. Você decide os próximos passos depois de conhecer a plataforma.",
  },
  {
    id: "cancelamento",
    question: "Posso deixar de receber os e-mails?",
    answer:
      "Sim. Basta responder a uma mensagem da Papum pedindo para não receber novos contatos. A equipe cuida da sua solicitação.",
  },
] as const;

export const CHANNEL_EVIDENCE = {
  value: "+88%",
  result:
    "de receita gerada pelos clientes analisados, na comparação dos seis meses antes e depois de adotarem o app próprio do restaurante.",
} as const;
