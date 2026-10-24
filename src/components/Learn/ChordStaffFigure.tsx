"use client";

import { useCallback } from "react";
import type { Factory } from "vexflow";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { StaffCanvas } from "@/components/Learn/StaffCanvas";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import type { NoteIndices } from "@/types/IndexTypes";
import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { drawChordStaff } from "@/utils/ChordStaffRenderer";

const C_MAJOR = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);

/** Explicitly spelled whole-note chords on a treble staff, optionally over the linear keyboard.
 * Spelling is taken as given, so it can show notation the app itself avoids. */
export function ChordStaffFigure({
  chords,
  caption,
  keySignature,
  highlightedNoteIndices,
  showKeyboard = true,
  isCompact = true,
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
}) {
  const draw = useCallback(
    (factory: Factory, width: number) => drawChordStaff(factory, width, chords, keySignature),
    [chords, keySignature],
  );

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <StaffCanvas draw={draw} />
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
