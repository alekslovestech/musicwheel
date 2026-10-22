"use client";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { actualToChromatic, chromaticToActual } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { ChordUtils } from "@/utils/ChordUtils";
import { NoteConverter } from "@/utils/NoteConverter";

/** A chord on the wheel and linear keyboard, Harmony-mode colors (no diatonic shading, no tonic
 * flag). The wheel's base-note dot follows whichever note is first in the chord's note array. */
export function StaticChordFigure({
  rootNote,
  chordType,
  inversionIndex,
  caption,
  isCompact = false,
  showLabels = false,
  showKeyboard = true,
}: {
  rootNote: string;
  chordType: NoteGroupingId;
  inversionIndex: number;
  caption: React.ReactNode;
  isCompact?: boolean;
  showLabels?: boolean;
  /** Set false to show only the wheel. */
  showKeyboard?: boolean;
}) {
  const musicalKey = MusicalKey.fromGreekMode(rootNote, ScaleModeType.Ionian);
  const chordRef = makeChordReference(
    chromaticToActual(NoteConverter.toChromaticIndex(rootNote)),
    chordType,
    inversionIndex,
  );
  const chordNotes = ChordUtils.calculateChordNotesFromChordReference(chordRef);

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <CircularKeyboardView
        musicalKey={musicalKey}
        highlightedNoteIndices={chordNotes}
        isScales={false}
        onKeyClick={null}
      />
      {showKeyboard && (
        <LinearKeyboardView
          musicalKey={musicalKey}
          highlightedNoteIndices={chordNotes}
          isScales={false}
          onKeyClick={null}
          isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
          showLabels={showLabels}
          isCompact={isCompact}
        />
      )}
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span className="whitespace-pre-line">{caption}</span>
      </figcaption>
    </figure>
  );
}
