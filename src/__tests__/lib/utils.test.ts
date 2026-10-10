import { describe, expect, it } from "vitest";

import { cn, isExternalHref } from "@/lib/utils";

describe("cn", () => {
  it("junta classes truthy e ignora falsy", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("resolve conflitos do Tailwind mantendo a última classe", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("isExternalHref", () => {
  it.each([
    "https://instagram.com",
    "http://x.com",
    "//cdn.com",
    "mailto:a@b.co",
    "tel:+5511999999999",
  ])("reconhece %s como externo", (href: string) => {
    expect(isExternalHref(href)).toBe(true);
  });

  it.each(["/", "/planos", "/planos/premium", "#secao"])(
    "reconhece %s como interno",
    (href: string) => {
      expect(isExternalHref(href)).toBe(false);
    },
  );
});
