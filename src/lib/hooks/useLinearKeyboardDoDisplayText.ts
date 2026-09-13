"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

import { WHITE_KEYS_PER_2OCTAVES } from "@/types/constants/NoteConstants";

/** 22rem for the full two-octave keyboard (14 white keys) - the per-white-key width below which a
 * note name or accidental tick can't fit legibly. Applied per white key so a compact one-octave
 * keyboard (half the keys) needs proportionally less width, instead of being held to the
 * two-octave keyboard's much wider threshold and hiding labels a narrow phone has plenty of room
 * for. */
const MIN_WIDTH_PX_PER_WHITE_KEY = (22 * 16) / WHITE_KEYS_PER_2OCTAVES;

export function useLinearKeyboardDoDisplayText(
  containerRef: RefObject<HTMLDivElement | null>,
  whiteKeyCount: number,
): boolean {
  const [doDisplayText, setDoDisplayText] = useState(true);
  const minWidthPx = whiteKeyCount * MIN_WIDTH_PX_PER_WHITE_KEY;

  // useLayoutEffect, not useEffect: this must correct the optimistic initial `true` before the
  // browser paints - see useIsLandscape for the same fix - otherwise a too-narrow container shows
  // labels for one frame and then hides them (a visible flash), instead of never showing them.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      setDoDisplayText(width >= minWidthPx);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, minWidthPx]);

  return doDisplayText;
}
