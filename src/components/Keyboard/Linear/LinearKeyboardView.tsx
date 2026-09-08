"use client";

import { useRef } from "react";

import { BLACK_KEY_WIDTH_RATIO, TWENTY4, WHITE_KEYS_PER_OCTAVE } from "@/types/constants/NoteConstants";
import { ActualIndex, actualToChromatic, chromaticToActual, ixActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { useLinearKeyboardDoDisplayText } from "@/lib/hooks/useLinearKeyboardDoDisplayText";
import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";

import { PianoKeyLinear } from "./PianoKeyLinear";

/**
 * The linear keyboard's one rendering implementation: two octaves of keys, note text once the
 * container is wide enough. KeyboardLinear (the live app) is a thin adapter that reads context and
 * forwards it here; Learn figures call this directly with plain data instead of hooks - the same
 * split CircularKeyboardView uses. Passing null for onKeyClick is what makes a call site
 * read-only - an omission, not a flag - so a static page can be trusted not to ship interactivity
 * from the prop alone.
 */
export function LinearKeyboardView({
  musicalKey,
  highlightedNoteIndices = [],
  isScales = true,
  onKeyClick,
  isBassNote = () => false,
  className,
  useRealisticColors = false,
  showAccidentalMarks = true,
  showNoteLabels = true,
  singleOctaveFromTonic = false,
}: {
  musicalKey: MusicalKey;
  highlightedNoteIndices?: NoteIndices;
  /** Scales-mode shading (diatonic vs. muted, plus the tonic flag) vs. Harmony-mode shading (a
   * plain chromatic keyboard, only selected notes colored) - the same distinction the live app
   * draws between its two modes. */
  isScales?: boolean;
  /** Pass null for a read-only keyboard. The live app passes its real click handler here. */
  onKeyClick: ((index: ActualIndex) => void) | null;
  isBassNote?: (index: ActualIndex) => boolean;
  className?: string;
  /** See PianoKeyLinear - real black/white keys with scale notes tinted, instead of the live app's
   * blue scale theme. */
  useRealisticColors?: boolean;
  /** See PianoKeyLinear - the small ♯/♭ ticks marking a black key from its white neighbor. */
  showAccidentalMarks?: boolean;
  /** See PianoKeyLinear - the note-name letter on white keys. */
  showNoteLabels?: boolean;
  /** One octave, tonic to tonic, instead of the live app's fixed two starting at C. */
  singleOctaveFromTonic?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doDisplayText = useLinearKeyboardDoDisplayText(containerRef);

  // Shorter than a literal per-key match to the live app's two-octave keyboard (aspect-[2/1] for
  // seven white keys), while keeping the black-key-on-white-key step visible.
  const resolvedClassName =
    className ??
    (singleOctaveFromTonic
      ? "relative flex box-border w-full max-h-full aspect-[3/1] p-[5px]"
      : "relative flex box-border w-full max-h-full aspect-[4/1] p-[5px]");

  const startIndex = singleOctaveFromTonic ? chromaticToActual(musicalKey.tonicIndex, 0) : 0;
  // Excludes the octave-repeat tonic (same pitch class as the first key).
  const endIndex = singleOctaveFromTonic ? startIndex + 11 : TWENTY4 - 1;

  const keys = [];
  for (let index = startIndex; index <= endIndex; index++) {
    const actualIndex = ixActual(index);
    const isShortKey = BlackKeyUtils.isBlackKey(actualToChromatic(actualIndex));
    keys.push(
      <PianoKeyLinear
        key={index}
        actualIndex={actualIndex}
        isBassNote={isBassNote(actualIndex)}
        doDisplayText={doDisplayText}
        onKeyClick={onKeyClick}
        selectedMusicalKey={musicalKey}
        selectedNoteIndices={highlightedNoteIndices}
        isScales={isScales}
        useRealisticColors={useRealisticColors}
        showAccidentalMarks={showAccidentalMarks}
        showNoteLabels={showNoteLabels}
        left={
          singleOctaveFromTonic
            ? LinearKeyboardUtils.getKeyPositionRelativeToTonic(actualIndex, musicalKey.tonicIndex)
            : undefined
        }
        widthPercent={
          singleOctaveFromTonic
            ? `${(((isShortKey ? BLACK_KEY_WIDTH_RATIO : 1) * 100) / WHITE_KEYS_PER_OCTAVE).toFixed(2)}%`
            : undefined
        }
      />,
    );
  }

  return (
    <div ref={containerRef} className={resolvedClassName}>
      <div className="relative w-full h-full">{keys}</div>
    </div>
  );
}
