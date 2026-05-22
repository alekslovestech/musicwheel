"use client";

import { useEffect, useState, type RefObject } from "react";

/** 22rem — min linear keyboard width before showing note names and accidentals. */
const LINEAR_KEYBOARD_DISPLAY_TEXT_MIN_WIDTH_PX = 22 * 16;

export function useLinearKeyboardDoDisplayText(
  containerRef: RefObject<HTMLDivElement | null>,
): boolean {
  const [doDisplayText, setDoDisplayText] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      setDoDisplayText(width >= LINEAR_KEYBOARD_DISPLAY_TEXT_MIN_WIDTH_PX);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return doDisplayText;
}
