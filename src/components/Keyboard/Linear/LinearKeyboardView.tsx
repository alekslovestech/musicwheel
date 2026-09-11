"use client";

import { useRef } from "react";

import { BLACK_KEY_WIDTH_RATIO, TWENTY4, WHITE_KEYS_PER_OCTAVE } from "@/types/constants/NoteConstants";
import { ActualIndex, actualToChromatic, ixActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { useLinearKeyboardDoDisplayText } from "@/lib/hooks/useLinearKeyboardDoDisplayText";
import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";

import { PianoKeyLinear } from "./PianoKeyLinear";

const CONTAINER_BASE_CLASSES = "relative flex box-border w-full max-h-full p-[5px]";
const COMPACT_CONTAINER_CLASSES = `${CONTAINER_BASE_CLASSES} aspect-[7/2]`;
const FULL_CONTAINER_CLASSES = `${CONTAINER_BASE_CLASSES} aspect-[4/1]`;
const KEYS_WRAPPER_CLASSES = "relative w-full h-full";

/** Renders the linear keyboard: one or two octaves of keys. KeyboardLinear is the live-app
 * adapter; Learn figures call this directly. */
export function LinearKeyboardView({
  musicalKey,
  highlightedNoteIndices = [],
  isScales = true,
  onKeyClick,
  isBassNote = () => false,
  className,
  useRealisticColors = false,
  showLabels = true,
  isCompact = false,
}: {
  musicalKey: MusicalKey;
  highlightedNoteIndices?: NoteIndices;
  /** Diatonic shading (Scales mode) vs. plain colored keys (Harmony mode). */
  isScales?: boolean;
  /** Pass null for a read-only keyboard. */
  onKeyClick: ((index: ActualIndex) => void) | null;
  isBassNote?: (index: ActualIndex) => boolean;
  className?: string;
  /** See PianoKeyLinear. */
  useRealisticColors?: boolean;
  /** See PianoKeyLinear. */
  showLabels?: boolean;
  /** Compact shows 1 octave, default shows 2. */
  isCompact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doDisplayText = useLinearKeyboardDoDisplayText(containerRef);

  const resolvedClassName =
    className ?? (isCompact ? COMPACT_CONTAINER_CLASSES : FULL_CONTAINER_CLASSES);

  const endIndex = isCompact ? 12 : TWENTY4 - 1;
  const oneOctaveWhiteKeys = WHITE_KEYS_PER_OCTAVE + 1; // inclusive of the C above

  const keys = [];
  for (let index = 0; index <= endIndex; index++) {
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
        showLabels={showLabels}
        left={isCompact ? LinearKeyboardUtils.getKeyPositionInOneOctave(actualIndex) : undefined}
        widthPercent={
          isCompact
            ? `${(((isShortKey ? BLACK_KEY_WIDTH_RATIO : 1) * 100) / oneOctaveWhiteKeys).toFixed(2)}%`
            : undefined
        }
      />,
    );
  }

  return (
    <div ref={containerRef} className={resolvedClassName}>
      <div className={KEYS_WRAPPER_CLASSES}>{keys}</div>
    </div>
  );
}
