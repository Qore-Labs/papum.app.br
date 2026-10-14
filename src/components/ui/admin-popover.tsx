"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import {
  getPopoverPosition,
  POPOVER_VIEWPORT_PADDING,
} from "@/lib/popover-position";
import { cn } from "@/lib/utils";

interface AdminPopoverProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function AdminPopover({
  id,
  title,
  children,
  className,
}: AdminPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const popover = ref.current;
    if (!popover) return;

    let trigger: HTMLElement | null = null;
    let frame = 0;
    let observer: ResizeObserver | null = null;

    function viewport() {
      const visual = window.visualViewport;
      return {
        top: visual?.offsetTop ?? 0,
        left: visual?.offsetLeft ?? 0,
        width: visual?.width ?? document.documentElement.clientWidth,
        height: visual?.height ?? window.innerHeight,
      };
    }

    function position() {
      if (!trigger || !popover) return;
      const bounds = viewport();
      const anchor = trigger.getBoundingClientRect();
      if (
        !trigger.isConnected ||
        trigger.getClientRects().length === 0 ||
        anchor.bottom <= bounds.top ||
        anchor.top >= bounds.top + bounds.height ||
        anchor.right <= bounds.left ||
        anchor.left >= bounds.left + bounds.width
      ) {
        if (popover.matches(":popover-open")) popover.hidePopover();
        return;
      }

      popover.style.maxWidth = `${Math.max(1, bounds.width - POPOVER_VIEWPORT_PADDING * 2)}px`;
      const placement = getPopoverPosition(
        anchor,
        {
          width: popover.offsetWidth,
          height:
            popover.scrollHeight + popover.offsetHeight - popover.clientHeight,
        },
        bounds,
      );
      popover.style.top = `${placement.top}px`;
      popover.style.left = `${placement.left}px`;
      popover.style.maxHeight = `${placement.maxHeight}px`;
      popover.style.setProperty("--popover-slide-x", `${placement.slideX}px`);
      popover.style.setProperty("--popover-slide-y", `${placement.slideY}px`);
      popover.style.transformOrigin = `${placement.originX}px ${placement.originY}px`;
      popover.dataset.side = placement.side;
    }

    function schedulePosition() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(position);
    }

    function stopTracking() {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      observer = null;
      window.removeEventListener("scroll", schedulePosition, true);
      window.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("scroll", schedulePosition);
      window.visualViewport?.removeEventListener("resize", schedulePosition);
    }

    function beforeToggle(event: Event) {
      if (!popover) return;
      const toggle = event as ToggleEvent & { source?: Element | null };
      if (toggle.newState !== "open") {
        popover.inert = true;
        stopTracking();
        return;
      }

      const source = toggle.source ?? document.activeElement;
      trigger =
        source instanceof HTMLElement &&
        source.getAttribute("popovertarget") === id &&
        source.getAttribute("popovertargetaction") !== "hide" &&
        !popover.contains(source)
          ? source
          : (Array.from(
              document.querySelectorAll<HTMLButtonElement>(
                "button[popovertarget]",
              ),
            ).find(
              (button) =>
                button.getAttribute("popovertarget") === id &&
                button.getAttribute("popovertargetaction") !== "hide" &&
                button.getClientRects().length > 0,
            ) ?? null);

      // Measure before native opening so its first painted frame is anchored.
      popover.style.visibility = "hidden";
      popover.style.display = "block";
      popover.style.maxHeight = "none";
      position();
      popover.style.removeProperty("display");
      popover.style.removeProperty("visibility");
      popover.inert = false;
    }

    function onToggle() {
      stopTracking();
      if (!popover?.matches(":popover-open") || !trigger) return;
      position();
      // Native autofocus may scroll the document before the anchored panel settles.
      closeRef.current?.focus({ preventScroll: true });
      window.addEventListener("scroll", schedulePosition, {
        capture: true,
        passive: true,
      });
      window.addEventListener("resize", schedulePosition);
      window.visualViewport?.addEventListener("scroll", schedulePosition, {
        passive: true,
      });
      window.visualViewport?.addEventListener("resize", schedulePosition);
      observer = new ResizeObserver(schedulePosition);
      observer.observe(trigger);
      observer.observe(popover);
    }

    popover.addEventListener("beforetoggle", beforeToggle);
    popover.addEventListener("toggle", onToggle);
    return () => {
      stopTracking();
      popover.removeEventListener("beforetoggle", beforeToggle);
      popover.removeEventListener("toggle", onToggle);
    };
  }, [id]);

  return (
    <div
      ref={ref}
      id={id}
      popover="auto"
      role="dialog"
      aria-labelledby={`${id}-title`}
      className={cn(
        "admin-popover z-50 w-80 rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-6 text-stone-700 shadow-xl",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2
          id={`${id}-title`}
          className="font-jakarta font-bold text-stone-900"
        >
          {title}
        </h2>
        <button
          ref={closeRef}
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          aria-label={`Fechar ${title.toLocaleLowerCase("pt-BR")}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
