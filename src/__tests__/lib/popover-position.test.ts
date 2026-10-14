import { describe, expect, it } from "vitest";

import { getPopoverPosition } from "@/lib/popover-position";

const viewport = { top: 0, left: 0, width: 1280, height: 900 };
const size = { width: 320, height: 240 };

describe("getPopoverPosition", () => {
  it("abre abaixo do botão quando há espaço e desliza a partir dele", () => {
    const result = getPopoverPosition(
      { top: 100, bottom: 144, left: 600, right: 644 },
      size,
      viewport,
    );
    expect(result.side).toBe("bottom");
    expect(result.top).toBe(152);
    expect(result.left).toBe(324);
    expect(result.slideY).toBeLessThan(0);
  });

  it("abre acima quando o botão está próximo da borda inferior", () => {
    const result = getPopoverPosition(
      { top: 820, bottom: 864, left: 600, right: 644 },
      size,
      viewport,
    );
    expect(result.side).toBe("top");
    expect(result.top + size.height).toBe(812);
    expect(result.slideY).toBeGreaterThan(0);
  });

  it("mantém o menu dentro da borda direita com movimento para a esquerda", () => {
    const result = getPopoverPosition(
      { top: 100, bottom: 144, left: 1240, right: 1284 },
      size,
      viewport,
    );
    expect(result.left + size.width).toBe(1268);
    expect(result.slideX).toBeGreaterThan(0);
    expect(result.originX).toBeLessThanOrEqual(size.width);
  });

  it("desloca para dentro na borda esquerda e acomoda telas pequenas", () => {
    const result = getPopoverPosition(
      { top: 60, bottom: 104, left: 0, right: 44 },
      size,
      { top: 0, left: 0, width: 320, height: 700 },
    );
    expect(result.left).toBe(12);
    expect(result.slideX).toBeLessThan(0);
    expect(result.top).toBe(112);
  });

  it("limita conteúdo longo ao lado com mais espaço sem sair da tela", () => {
    const result = getPopoverPosition(
      { top: 500, bottom: 544, left: 600, right: 644 },
      { width: 320, height: 1000 },
      viewport,
    );
    expect(result.side).toBe("top");
    expect(result.maxHeight).toBe(480);
    expect(result.top).toBe(12);
  });

  it("considera a área visível deslocada por zoom ou teclado virtual", () => {
    const result = getPopoverPosition(
      { top: 380, bottom: 424, left: 310, right: 354 },
      size,
      { top: 200, left: 100, width: 390, height: 260 },
    );
    expect(result.side).toBe("top");
    expect(result.top).toBeGreaterThanOrEqual(212);
    expect(result.left).toBeGreaterThanOrEqual(112);
    expect(
      result.top + Math.min(size.height, result.maxHeight),
    ).toBeLessThanOrEqual(448);
  });

  it("evita movimento horizontal quando o botão está alinhado ao centro", () => {
    const result = getPopoverPosition(
      { top: 100, bottom: 144, left: 300, right: 620 },
      size,
      viewport,
    );
    expect(result.slideX).toBe(0);
  });
});
