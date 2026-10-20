"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Factory } from "vexflow";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { COMMON_STYLES, FIGURE_KEY_BORDER, LEARN_STYLES, STAFF_HEIGHT_PX } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import type { NoteIndices } from "@/types/IndexTypes";
import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { drawStaticStaff } from "@/utils/StaticStaffRenderer";

const C_MAJOR = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);

/** Explicitly spelled whole-note chords on a treble staff, optionally over the linear keyboard.
 * Spelling is taken as given, so it can show notation the app itself avoids. */
export function StaticStaffFigure({
  chords,
  caption,
  keySignature,
  highlightedNoteIndices,
  showKeyboard = true,
}: {
  chords: readonly (readonly NoteWithOctave[])[];
  caption: string;
  /** VexFlow key spec, e.g. "Cm" or "F#". */
  keySignature?: string;
  highlightedNoteIndices?: NoteIndices;
  /** Set false to omit the keyboard even when highlightedNoteIndices is given. */
  showKeyboard?: boolean;
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
    const factory = new Factory({
      renderer: { elementId: staffId, width, height: container.clientHeight },
    });
    drawStaticStaff(factory, width, chords, keySignature);
  }, [chords, keySignature, staffId, width]);

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <div
        ref={containerRef}
        className={COMMON_STYLES.staff}
        style={{ height: STAFF_HEIGHT_PX }}
      >
        <div id={staffId} ref={staffDivRef} style={{ width: "100%", height: "100%" }} />
      </div>
      {showKeyboard && highlightedNoteIndices && (
        <LinearKeyboardView
          musicalKey={C_MAJOR}
          highlightedNoteIndices={highlightedNoteIndices}
          isScales={false}
          onKeyClick={null}
          isCompact={true}
        />
      )}
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span className="whitespace-pre-line">{caption}</span>
      </figcaption>
    </figure>
  );
}
