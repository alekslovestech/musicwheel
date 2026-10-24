"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Factory } from "vexflow";

import { COMMON_STYLES, STAFF_HEIGHT_PX } from "@/lib/design";

/** A fixed-height strip that a figure draws its staff into. `draw` gets a VexFlow factory and the
 * strip's current width; the staff is redrawn when the width or `draw` changes, so callers should
 * keep `draw` stable (useCallback) unless what it draws has changed. */
export function StaffCanvas({ draw }: { draw: (factory: Factory, width: number) => void }) {
  const staffId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const staffDivRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setWidth(container.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setWidth(container.clientWidth));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const staffDiv = staffDivRef.current;
    const container = containerRef.current;
    if (!staffDiv || !container || width === 0) return;

    staffDiv.innerHTML = "";
    const factory = new Factory({
      renderer: { elementId: staffId, width, height: container.clientHeight },
    });
    draw(factory, width);
  }, [draw, staffId, width]);

  return (
    <div ref={containerRef} className={COMMON_STYLES.staff} style={{ height: STAFF_HEIGHT_PX }}>
      <div id={staffId} ref={staffDivRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
