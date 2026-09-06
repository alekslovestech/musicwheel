"use client";

import { StaticKeyboardCircular } from "@/components/Keyboard/Circular/StaticKeyboardCircular";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { chromaticToActual } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { ChordUtils } from "@/utils/ChordUtils";
import { NoteConverter } from "@/utils/NoteConverter";

/**
 * A chord voicing on the wheel, rendered Harmony-mode (isScales=false) rather than Scales-mode: a
 * plain chromatic keyboard with only the chord tones colored, no diatonic/muted shading and no
 * tonic flag - a scale concept a lone chord doesn't have. The highlighted triangle plus the same
 * base-note dot the live app draws at whichever note is first in the array - not tied to pitch
 * class. Chord notes come back from ChordUtils bass-first per inversion, so passing them straight
 * through lands the dot on the actual current bass, and root position / first inversion / second
 * inversion of the same chord each highlight a different one, even though all three light the
 * same three wedges.
 */
export function StaticChordFigure({
  rootNote,
  chordType,
  inversionIndex,
  caption,
}: {
  rootNote: string;
  chordType: NoteGroupingId;
  inversionIndex: number;
  caption: string;
}) {
  const musicalKey = MusicalKey.fromGreekMode(rootNote, ScaleModeType.Ionian);
  const chordRef = makeChordReference(
    chromaticToActual(NoteConverter.toChromaticIndex(rootNote)),
    chordType,
    inversionIndex,
  );
  const chordNotes = ChordUtils.calculateChordNotesFromChordReference(chordRef);

  return (
    <figure className={LEARN_STYLES.figureCard}>
      <StaticKeyboardCircular
        musicalKey={musicalKey}
        highlightedNoteIndices={chordNotes}
        isScales={false}
      />
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
