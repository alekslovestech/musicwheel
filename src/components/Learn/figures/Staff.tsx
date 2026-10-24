"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Factory } from "vexflow";

import { COMMON_STYLES, STAFF_HEIGHT_PX } from "@/lib/design";
import type { DuratedNoteChord } from "@/types/Durated";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { type VexFlowDrawVoiceOptions, VexFlowUtils } from "@/utils/VexFlowUtils";

/** A treble staff with a key signature and one voice of chords, in a fixed-height strip that
 * fills its container's width. All the VexFlow drawing lives here; figures just supply data.
 * Redrawn when the data or the width changes, so memoize `steps` (useMemo) in the caller. */
export function Staff({
  keySignature,
  steps,
  voiceTime,
  stemless,
  maxWidth,
}: {
  /** VexFlow key spec, e.g. "Cm" or "F#". */
  keySignature?: string;
  /** The chords to draw, left to right. Empty draws just the clef and key signature. */
  steps: readonly DuratedNoteChord[];
  /** VexFlow voice meter - see {@link VexFlowDrawVoiceOptions}. */
  voiceTime?: VexFlowDrawVoiceOptions["voiceTime"];
  stemless?: VexFlowDrawVoiceOptions["stemless"];
  /** Cap on the drawn staff's width in px; the staff is centered in the strip. */
  maxWidth?: number;
}) {
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
    const drawWidth = maxWidth === undefined ? width : Math.min(width, maxWidth);
    const factory = new Factory({
      renderer: { elementId: staffId, width: drawWidth, height: container.clientHeight },
    });

    const stave = VexFlowUtils.createStaveForContainer(factory, drawWidth);
    stave.addClef("treble");
    if (keySignature) stave.addKeySignature(keySignature);
    stave.setContext(factory.getContext()).draw();
    if (steps.length === 0) return;

    VexFlowUtils.drawVoice(
      factory,
      stave,
      VexFlowFormatter.createStaveChordNotes([...steps], factory),
      { voiceTime, stemless },
    );
  }, [keySignature, steps, voiceTime, stemless, maxWidth, staffId, width]);

  return (
    <div ref={containerRef} className={COMMON_STYLES.staff} style={{ height: STAFF_HEIGHT_PX }}>
      <div
        id={staffId}
        ref={staffDivRef}
        style={{
          width: maxWidth === undefined ? "100%" : `min(100%, ${maxWidth}px)`,
          height: "100%",
        }}
      />
    </div>
  );
}
