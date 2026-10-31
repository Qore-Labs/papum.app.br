import { siteConfig } from "@/utils/config/site";

interface EmailFooterLink {
  id: string;
  label: string;
  href: string;
  iconUrl: string;
}

interface ConfirmationEmailContent {
  preheader: string;
  heading: string;
  greeting: string;
  introduction: string;
  nextStep: string;
  thanks: string;
  footerNotice: string;
}

interface NotificationEmailContent {
  preheader: string;
  heading: string;
  introduction: string;
  contactLabel: string;
  originLabel: string;
  origin: string;
  instruction: string;
  actionLabel: string;
  footerNotice: string;
}

export const LAUNCH_EMAIL_BRAND = {
  logoUrl: new URL("/email/papum-logo.png", siteConfig.url).href,
  logoAlt: "Pápum! Delivery",
  signature: "Equipe Pápum Delivery",
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
    label: "Visite nosso site",
    href: siteConfig.url,
    iconUrl: new URL("/email/website.png", siteConfig.url).href,
  },
] satisfies readonly EmailFooterLink[];

export const CONFIRMATION_EMAIL_CONTENT = {
  preheader: "Seu interesse chegou. Que bom ter você com a Papum!",
  heading: "Seu contato chegou.",
  greeting: "Que bom ter você por aqui!",
  introduction:
    "Recebemos seu contato e ficamos felizes com seu interesse no Pápum Delivery.",
  nextStep:
    "Um app com a identidade do seu restaurante e um painel para organizar cardápio, pedidos e contatos: essa é a proposta da Papum. Vamos compartilhar as informações sobre a plataforma por este e-mail.",
  thanks: "Obrigado pelo seu interesse!",
  footerNotice:
    "Você recebeu esta mensagem porque demonstrou interesse na Papum Delivery. Para cancelar os avisos ou informar que não fez essa solicitação, responda a este e-mail.",
} satisfies ConfirmationEmailContent;

export const NOTIFICATION_EMAIL_CONTENT = {
  preheader: "Um novo contato chegou pelo site da Papum Delivery.",
  heading: "Mais um contato chegou.",
  introduction:
    "Uma pessoa demonstrou interesse na Papum Delivery e pediu para receber informações.",
  contactLabel: "E-mail do interessado",
  originLabel: "Origem",
  origin: "Página de lançamento · /lancamento",
  instruction:
    "Use o botão abaixo ou responda a esta mensagem para entrar em contato com ela.",
  actionLabel: "Responder ao interessado",
  footerNotice:
    "Notificação interna de um contato recebido pelo site da Papum Delivery.",
} satisfies NotificationEmailContent;
