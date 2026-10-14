import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminPopover } from "@/components/ui/admin-popover";

let opened: WeakSet<Element>;

// jsdom has no native Popover API or layout. Keep that boundary simulated;
// keyboard, light dismiss and animation are also checked in a real browser.
function nativeToggle(popover: HTMLElement, source: Element, open: boolean) {
  const state = open ? "open" : "closed";
  const before = new Event("beforetoggle");
  Object.assign(before, { newState: state, source });
  popover.dispatchEvent(before);
  if (open) opened.add(popover);
  else opened.delete(popover);
  const toggle = new Event("toggle");
  Object.assign(toggle, { newState: state, source });
  popover.dispatchEvent(toggle);
}

function nativeClick(event: MouseEvent) {
  const button =
    event.target instanceof Element
      ? event.target.closest("button[popovertarget]")
      : null;
  if (!button) return;
  const popover = document.getElementById(
    button.getAttribute("popovertarget") ?? "",
  );
  if (popover) nativeToggle(popover, button, !opened.has(popover));
}

beforeEach(() => {
  opened = new WeakSet();
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selector,
  ) {
    return selector === ":popover-open"
      ? opened.has(this)
      : matches.call(this, selector);
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(700, 100, 44, 44),
  );
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([
    new DOMRect(700, 100, 44, 44),
  ] as unknown as DOMRectList);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(320);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(240);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(240);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(240);
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
    1280,
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  document.addEventListener("click", nativeClick);
});

afterEach(() => {
  document.removeEventListener("click", nativeClick);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderPopover() {
  return render(
    <>
      <button type="button" popoverTarget="test-actions">
        Abrir ações
      </button>
      <AdminPopover id="test-actions" title="Ações">
        <button type="button">Editar cliente</button>
      </AdminPopover>
    </>,
  );
}

describe("AdminPopover", () => {
  it("posiciona as ações junto ao botão que abriu o contexto", async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole("button", { name: "Abrir ações" }));
    const dialog = screen.getByRole("dialog", { name: "Ações" });
    expect(dialog).toHaveStyle({ top: "152px", left: "424px" });
    expect(dialog).toHaveAttribute("data-side", "bottom");
    expect(screen.getByRole("button", { name: "Fechar ações" })).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Editar cliente" }),
    ).toBeInTheDocument();
  });

  it("desativa controles durante a saída e os restaura ao reabrir", async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Abrir ações" });
    const dialog = screen.getByRole("dialog", { name: "Ações" });
    await user.click(trigger);
    expect(dialog.inert).toBe(false);
    await user.click(screen.getByRole("button", { name: "Fechar ações" }));
    expect(dialog.inert).toBe(true);
    await user.click(trigger);
    expect(dialog.inert).toBe(false);
  });

  it("remove o acompanhamento de scroll ao fechar e desmontar", async () => {
    const user = userEvent.setup();
    const { unmount } = renderPopover();
    const remove = vi.spyOn(window, "removeEventListener");
    await user.click(screen.getByRole("button", { name: "Abrir ações" }));
    await user.click(screen.getByRole("button", { name: "Fechar ações" }));
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function), true);
    remove.mockClear();
    unmount();
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
