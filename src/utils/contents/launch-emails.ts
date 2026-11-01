import { siteConfig } from "@/utils/config/site";

interface EmailFooterLink {
  id: string;
  label: string;
  href: string;
  iconUrl: string;
}

interface ConfirmationEmailContent {
  subject: string;
  preheader: string;
  heading: string;
  introduction: string;
  productHeading: string;
  productDescription: string;
  action: EmailAction;
  footerNotice: string;
}

interface EmailAction {
  label: string;
  href: string;
}

interface NotificationEmailContent {
  subject: string;
  preheader: string;
  heading: string;
  introduction: string;
  contactLabel: string;
  originLabel: string;
  instruction: string;
  actionLabel: string;
  footerNotice: string;
}

export const LAUNCH_EMAIL_BRAND = {
  logoUrl: new URL("/email/papum-logo-yellow.png", siteConfig.url).href,
  illustrationUrl: new URL("/email/papum-orders.png", siteConfig.url).href,
  boltUrl: new URL("/email/papum-bolt.png", siteConfig.url).href,
  logoAlt: "Papum Delivery",
  signature: "Equipe Papum Delivery",
  closing: "Até já,",
};

export const LAUNCH_EMAIL_FOOTER_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: siteConfig.social.instagram,
    iconUrl: new URL("/email/instagram.png", siteConfig.url).href,
  },
  {
    id: "website",
    label: "Site da Papum",
    href: siteConfig.url,
    iconUrl: new URL("/email/website.png", siteConfig.url).href,
  },
] satisfies readonly EmailFooterLink[];

export const CONFIRMATION_EMAIL_CONTENT = {
  subject: "Recebemos seu cadastro | Papum Delivery",
  preheader: "As novidades da Papum vão chegar por este e-mail.",
  heading: "Que bom ter você por aqui.",
  introduction:
    "Seu cadastro de interesse na Papum Delivery foi recebido. Vamos enviar novidades e avisar por aqui quando a plataforma estiver disponível.",
  productHeading: "A marca é sua. A estrutura é Pápum.",
  productDescription:
    "Um app com a identidade do seu restaurante e um painel para organizar cardápio, pedidos e contatos.",
  action: {
    label: "Acompanhar no Instagram",
    href: siteConfig.social.instagram,
  },
  footerNotice:
    "Você recebeu esta mensagem porque se cadastrou para acompanhar a Papum Delivery. Para cancelar os avisos ou informar que não fez esse cadastro, responda a este e-mail.",
} satisfies ConfirmationEmailContent;

export const NOTIFICATION_EMAIL_CONTENT = {
  subject: "Novo cadastro de interesse | Papum Delivery",
  preheader: "Um novo contato quer acompanhar as novidades da Papum.",
  heading: "Novo cadastro recebido.",
  introduction:
    "Uma pessoa se cadastrou para receber novidades da Papum Delivery.",
  contactLabel: "E-mail do interessado",
  originLabel: "Origem",
  instruction: "Você também pode responder diretamente a esta mensagem.",
  actionLabel: "Responder ao interessado",
  footerNotice:
    "Notificação interna de um cadastro recebido pelo site da Papum Delivery.",
} satisfies NotificationEmailContent;
