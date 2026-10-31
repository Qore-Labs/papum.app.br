export type LeadEntry = "home" | "instagram" | "lancamento";

export const LEAD_ORIGINS: Record<LeadEntry, string> = {
  home: "Site Papum · página principal",
  instagram: "Instagram · link da bio · /instagram",
  lancamento: "Página de cadastro · /lancamento",
};

export function getCampaign(pathname: string): Record<string, string> {
  return pathname === "/instagram"
    ? {
        campaign_source: "instagram",
        campaign_medium: "social",
        campaign_name: "validacao",
        campaign_content: "bio",
      }
    : {};
}
