"use client";

import { useMemo } from "react";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { Staff } from "@/components/Learn/figures/Staff";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { makeDurated } from "@/types/Durated";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import type { NoteIndices } from "@/types/IndexTypes";
import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";

const C_MAJOR = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);

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
  /** One-off: a staff narrower than its card, for a key signature shown with no notes. */
  staffMaxWidth?: number;
}) {
  const steps = useMemo(() => chords.map((chord) => makeDurated([...chord], 1)), [chords]);

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <Staff
        keySignature={keySignature}
        steps={steps}
        voiceTime={`${steps.length}/1`}
        maxWidth={staffMaxWidth}
      />
      {showKeyboard && highlightedNoteIndices && (
        <LinearKeyboardView
          musicalKey={C_MAJOR}
          highlightedNoteIndices={highlightedNoteIndices}
          isScales={false}
          onKeyClick={null}
          isCompact={isCompact}
        />
      )}
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span className="whitespace-pre-line">{caption}</span>
      </figcaption>
    </figure>
  );
}
