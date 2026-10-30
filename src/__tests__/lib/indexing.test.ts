// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => vi.unstubAllEnvs());

describe("Liberação explícita da indexação", () => {
  it.each([undefined, "false", "1", "TRUE"])(
    "mantém o pré-lançamento fora do sitemap com configuração %s",
    async (value) => {
      vi.resetModules();
      vi.stubEnv("SITE_INDEXING_ENABLED", value);
      const { searchIndexingEnabled } = await import("@/utils/config/indexing");
      const { default: robots } = await import("../../../app/robots");
      const { GET } = await import("../../../app/sitemap.xml/route");
      expect(searchIndexingEnabled).toBe(false);
      expect(robots().sitemap).toBeUndefined();
      expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
      expect(GET().status).toBe(404);
    },
  );

  it("expõe somente URLs públicas canônicas quando a liberação é explícita", async () => {
    vi.resetModules();
    vi.stubEnv("SITE_INDEXING_ENABLED", "true");
    const { default: robots } = await import("../../../app/robots");
    const { GET } = await import("../../../app/sitemap.xml/route");
    expect(robots().sitemap).toBe("https://www.papum.app.br/sitemap.xml");
    const response = GET();
    expect(response.status).toBe(200);
    const xml = await response.text();
    expect(xml.match(/<loc>/g)).toHaveLength(2);
    expect(xml).toContain("https://www.papum.app.br/lancamento");
    expect(xml).not.toMatch(/dashboard|login/);
  });
});
