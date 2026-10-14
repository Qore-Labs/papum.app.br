interface PopoverAnchor {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface PopoverSize {
  width: number;
  height: number;
}

interface PopoverViewport {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PopoverPosition {
  top: number;
  left: number;
  maxHeight: number;
  side: "top" | "bottom";
  slideX: number;
  slideY: number;
  originX: number;
  originY: number;
}

export const POPOVER_VIEWPORT_PADDING = 12;
const POPOVER_GAP = 8;
const POPOVER_SLIDE = 8;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function getPopoverPosition(
  anchor: PopoverAnchor,
  size: PopoverSize,
  viewport: PopoverViewport,
): PopoverPosition {
  const minTop = viewport.top + POPOVER_VIEWPORT_PADDING;
  const minLeft = viewport.left + POPOVER_VIEWPORT_PADDING;
  const maxBottom = viewport.top + viewport.height - POPOVER_VIEWPORT_PADDING;
  const maxRight = viewport.left + viewport.width - POPOVER_VIEWPORT_PADDING;
  const below = Math.max(0, maxBottom - anchor.bottom - POPOVER_GAP);
  const above = Math.max(0, anchor.top - POPOVER_GAP - minTop);
  const side = below >= size.height || below >= above ? "bottom" : "top";
  const maxHeight = Math.max(1, side === "bottom" ? below : above);
  const height = Math.min(size.height, maxHeight);
  const width = Math.min(
    size.width,
    Math.max(1, viewport.width - POPOVER_VIEWPORT_PADDING * 2),
  );
  const left = clamp(anchor.right - width, minLeft, maxRight - width);
  const top = clamp(
    side === "bottom"
      ? anchor.bottom + POPOVER_GAP
      : anchor.top - POPOVER_GAP - height,
    minTop,
    maxBottom - height,
  );
  const anchorCenter = (anchor.left + anchor.right) / 2;
  const horizontalDistance = anchorCenter - (left + width / 2);

  return {
    top,
    left,
    maxHeight,
    side,
    // Start toward the trigger, then slide into the available viewport space.
    slideX:
      Math.abs(horizontalDistance) > POPOVER_SLIDE
        ? Math.sign(horizontalDistance) * POPOVER_SLIDE
        : 0,
    slideY: side === "bottom" ? -POPOVER_SLIDE : POPOVER_SLIDE,
    originX: clamp(anchorCenter - left, 0, width),
    originY: side === "bottom" ? 0 : height,
  };
}
