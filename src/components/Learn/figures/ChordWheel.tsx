"use client";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { FigureFrame } from "@/components/Learn/figures/FigureFrame";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { actualToChromatic, chromaticToActual } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { ChordUtils } from "@/utils/ChordUtils";
import { NoteConverter } from "@/utils/NoteConverter";

/** A chord on the wheel and linear keyboard, Harmony-mode colors (no diatonic shading, no tonic
 * flag). The wheel's base-note dot follows whichever note is first in the chord's note array. */
export function ChordWheel({
  rootNote,
  chordType,
  inversionIndex,
  caption,
  isCompact = false,
  showLabels = false,
  showKeyboard = true,
  bare = false,
}: {
  rootNote: string;
  chordType: NoteGroupingId;
  inversionIndex: number;
  caption: React.ReactNode;
  isCompact?: boolean;
  showLabels?: boolean;
  /** Set false to show only the wheel. */
  showKeyboard?: boolean;
  /** Render just the figure - no card, padding or caption - for use as an image. */
  bare?: boolean;
}) {
  const musicalKey = MusicalKey.fromGreekMode(rootNote, ScaleModeType.Ionian);
  const chordRef = makeChordReference(
    chromaticToActual(NoteConverter.toChromaticIndex(rootNote)),
    chordType,
    inversionIndex,
  );
  const chordNotes = ChordUtils.calculateChordNotesFromChordReference(chordRef);

  return (
    <FigureFrame
      bare={bare}
      caption={
        <>
          <span className="whitespace-pre-line">{caption}</span>
        </>
      }
    >
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
    </FigureFrame>
  );
}
