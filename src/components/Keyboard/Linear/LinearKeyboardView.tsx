"use client";

import { useRef } from "react";

import {
  TWELVE,
  TWENTY4,
  BLACK_KEY_WIDTH_RATIO,  
  WHITE_KEYS_PER_OCTAVE,
  WHITE_KEYS_PER_2OCTAVES,
  
} from "@/types/constants/NoteConstants";
import { ActualIndex, actualToChromatic, ixActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { useLinearKeyboardDoDisplayText } from "@/lib/hooks/useLinearKeyboardDoDisplayText";
import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";

import {
  getScaleBoundaryLeftPercentages,
  SCALE_BOUNDARY_FLAG_HEIGHT,
  SCALE_BOUNDARY_FLAG_POINTS,
  SCALE_BOUNDARY_FLAG_VIEWBOX,
  SCALE_BOUNDARY_FLAG_WIDTH,
} from "./linearGeometry";
import { PianoKeyLinear } from "./PianoKeyLinear";

const CONTAINER_PADDING_PX = 5;
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
  showScaleBoundaryFlag = false,
}: {
  musicalKey: MusicalKey;
  highlightedNoteIndices?: NoteIndices;
  isScales?: boolean;
  onKeyClick: ((index: ActualIndex) => void) | null;
  isBassNote?: (index: ActualIndex) => boolean;
  className?: string;
  useRealisticColors?: boolean;
  showLabels?: boolean;  
  isCompact?: boolean; /** Compact shows 1 octave, default shows 2. */  
  showScaleBoundaryFlag?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const oneOctaveWhiteKeys = WHITE_KEYS_PER_OCTAVE + 1; // inclusive of the C above
  const doDisplayText = useLinearKeyboardDoDisplayText(
    containerRef,
    isCompact ? oneOctaveWhiteKeys : WHITE_KEYS_PER_2OCTAVES,
  );

  const resolvedClassName =
    className ?? (isCompact ? COMPACT_CONTAINER_CLASSES : FULL_CONTAINER_CLASSES);

  // The flag protrudes above the keyboard rather than overlapping it (see linearGeometry.ts) -
  // reserve that much extra top padding so it isn't clipped by an ancestor's overflow-hidden,
  // rather than relying on slack that happens to exist around the keyboard in its container.
  const showFlag = isScales && showScaleBoundaryFlag && !isCompact;
  const containerStyle = showFlag
    ? { paddingTop: CONTAINER_PADDING_PX + SCALE_BOUNDARY_FLAG_HEIGHT }
    : undefined;

  const endIndex = isCompact ? TWELVE : TWENTY4 - 1;

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
    <div ref={containerRef} className={resolvedClassName} style={containerStyle}>
      <div className={KEYS_WRAPPER_CLASSES}>
        {keys}
        {showFlag &&
          getScaleBoundaryLeftPercentages(musicalKey.tonicIndex, isCompact).map(
            (leftPercent, index) => (
              <svg
                key={index}
                viewBox={SCALE_BOUNDARY_FLAG_VIEWBOX}
                className="pointer-events-none absolute z-10 overflow-visible"
                style={{
                  left: `${leftPercent}%`,
                  top: -SCALE_BOUNDARY_FLAG_HEIGHT,
                  width: SCALE_BOUNDARY_FLAG_WIDTH,
                  height: SCALE_BOUNDARY_FLAG_HEIGHT,
                }}
              >
                <polygon points={SCALE_BOUNDARY_FLAG_POINTS} className="fill-keys-scaleBoundaryColor" />
              </svg>
            ),
          )}
      </div>
    </div>
  );
}
