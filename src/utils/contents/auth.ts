import type { ComponentType, SVGProps } from "react";

import { FacebookIcon, GoogleIcon } from "@/components/ui/icons";

interface SocialLoginProvider {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const SOCIAL_LOGIN_PROVIDERS = [
  { id: "google", label: "Entrar com Google", icon: GoogleIcon },
  { id: "facebook", label: "Entrar com Facebook", icon: FacebookIcon },
] satisfies readonly SocialLoginProvider[];
