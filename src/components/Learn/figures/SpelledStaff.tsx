"use client";

import { useMemo } from "react";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { Staff } from "@/components/Learn/figures/Staff";
import { FigureFrame } from "@/components/Learn/figures/FigureFrame";
import { makeDurated } from "@/types/Durated";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import type { NoteIndices } from "@/types/IndexTypes";
import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";

const C_MAJOR = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);

/** Room for a clef and one whole-note chord with its accidentals; anything wider is just empty
 * staff line. Not applied with a key signature, whose width depends on the key. */
const SINGLE_CHORD_STAFF_WIDTH = 200;

/** Explicitly spelled whole-note chords on a treble staff, optionally over the linear keyboard.
 *
 * The exception among the Learn figures: every other figure derives its notes, spelling and
 * highlighting from the app's own logic, so it can only show what the app shows. This one takes
 * the spelling as given, for the few articles that need to show
 * notation the app itself avoids. Don't reach for it to illustrate ordinary chords or scales. */
export function SpelledStaff({
  chords,
  caption,
  keySignature,
  highlightedNoteIndices,
  showKeyboard = true,
  isCompact = true,
  staffMaxWidth,
  bare = false,
  crossedOut = false,
}: {
  chords: readonly (readonly NoteWithOctave[])[];
  caption: string;
  /** VexFlow key spec, e.g. "Cm" or "F#". */
  keySignature?: string;
  highlightedNoteIndices?: NoteIndices;
  /** Set false to omit the keyboard even when highlightedNoteIndices is given. */
  showKeyboard?: boolean;
  /** Single-octave keyboard (the default, matching the chords' range), or the full two octaves. */
  isCompact?: boolean;
  /** A staff narrower than its card. Defaults to a compact width for a lone chord with no key
   * signature; otherwise the staff fills the card. */
  staffMaxWidth?: number;
  /** Render just the figure - no card, padding or caption - for use as an image. */
  bare?: boolean;
  /** Strike through the staff, for a spelling the article shows only to set aside. */
  crossedOut?: boolean;
}) {
  const steps = useMemo(() => chords.map((chord) => makeDurated([...chord], 1)), [chords]);
  const maxWidth =
    staffMaxWidth ?? (chords.length === 1 && !keySignature ? SINGLE_CHORD_STAFF_WIDTH : undefined);

  return (
    <FigureFrame
      bare={bare}
      caption={
        <>
          <span className="whitespace-pre-line">{caption}</span>
        </>
      }
    >
      <div className="relative mx-auto w-full" style={{ maxWidth }}>
        <Staff
          keySignature={keySignature}
          steps={steps}
          voiceTime={`${steps.length}/1`}
          maxWidth={maxWidth}
        />
        {crossedOut && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-red-500"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            role="img"
            aria-label="Crossed out"
          >
            <line
              x1="15"
              y1="85"
              x2="85"
              y2="15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
      {showKeyboard && highlightedNoteIndices && (
        <LinearKeyboardView
          musicalKey={C_MAJOR}
          highlightedNoteIndices={highlightedNoteIndices}
          isScales={false}
          onKeyClick={null}
          isCompact={isCompact}
        />
      )}
    </FigureFrame>
  );
}
