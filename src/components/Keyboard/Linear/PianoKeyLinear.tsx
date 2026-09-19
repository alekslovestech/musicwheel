import React from "react";

import { TYPOGRAPHY } from "@/lib/design/Typography";

import { ActualIndex, NoteIndices } from "@/types/IndexTypes";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import {
  BLACK_KEY_WIDTH_RATIO,
  WHITE_KEYS_PER_OCTAVE,
  WHITE_KEYS_PER_2OCTAVES,
} from "@/types/constants/NoteConstants";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";
import { VisualStateUtils } from "@/utils/visual/VisualStateUtils";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";

const KEY_BASE_CLASSES = "absolute box-border flex shadow-linear-key";
const SHORT_KEY_CLASSES = "h-[60%] -translate-x-1/2 z-[2]";
const TALL_KEY_CLASSES = "h-full z-[1] items-end";
const ACCIDENTAL_CLASSES = "absolute top-2/3 -translate-y-1/2";
const NOTE_LABEL_CLASSES = "text-center w-full leading-none mb-0.5";

interface PianoKeyLinearProps {
  actualIndex: ActualIndex;
  isBassNote: boolean;
  doDisplayText: boolean;
  /** Pass null for a read-only keyboard. */
  onKeyClick: ((index: ActualIndex) => void) | null;
  selectedMusicalKey: MusicalKey;
  selectedNoteIndices: NoteIndices;
  isScales: boolean;
  /** Real black/white key colors instead of the live app's blue Scales-mode theme. */
  useRealisticColors?: boolean;
  /** The note-name letter on white keys, and the small ♯/♭ ticks marking a black-key neighbor. */
  showLabels?: boolean;
  /** Single-octave positioning (C to the C above, inclusive) instead of the full two-octave
   * layout - see LinearKeyboardUtils.getKeyPositionInOneOctave. */
  isCompact?: boolean;
}

export const PianoKeyLinear: React.FC<PianoKeyLinearProps> = ({
  actualIndex,
  isBassNote,
  doDisplayText,
  onKeyClick,
  selectedMusicalKey,
  selectedNoteIndices,
  isScales,
  useRealisticColors = false,
  showLabels = true,
  isCompact = false,
}) => {
  const isSelected = KeyboardUtils.isKeySelected(
    actualIndex,
    selectedNoteIndices,
    KeyboardUIType.Linear,
  );
  const { chromaticIndex, isBlack: isShortKey, isDiatonicInScale, allBaseClasses, id, noteText } =
    KeyboardUtils.getKeyVisualState(
      actualIndex,
      KeyboardUIType.Linear,
      isScales,
      selectedMusicalKey,
      isSelected,
      isBassNote,
    );
  const left = isCompact
    ? LinearKeyboardUtils.getKeyPositionInOneOctave(actualIndex)
    : LinearKeyboardUtils.getKeyPosition(actualIndex);

  const {
    prevAccidentalExists,
    nextAccidentalExists,
    prevAccidentalSelected,
    nextAccidentalSelected,
  } = KeyboardUtils.getAdjacentKeyState(chromaticIndex, selectedNoteIndices);

  const widthRatio = isShortKey ? BLACK_KEY_WIDTH_RATIO : 1;
  const totalWhiteKeys = isCompact ? WHITE_KEYS_PER_OCTAVE + 1 : WHITE_KEYS_PER_2OCTAVES;
  const keyWidthAsPercent = `${((widthRatio * 100) / totalWhiteKeys).toFixed(2)}%`;

  const keyColors = useRealisticColors
    ? VisualStateUtils.getRealisticScaleKeyColors(
        isShortKey,
        isDiatonicInScale,
        isSelected,
        isBassNote,
        false,
      )
    : VisualStateUtils.getKeyColors(
        isScales,
        isDiatonicInScale,
        isBassNote,
        isShortKey,
        isSelected,
        false,
      );

  const renderAccidental = (accidental: AccidentalType, isSelected: boolean) => {
    const isSharp = accidental === AccidentalType.Sharp;
    const colorClass = VisualStateUtils.getTextColorClassForNonScaleMode(isSelected, false, false);
    return (
      <span
        className={`${ACCIDENTAL_CLASSES} ${isSharp ? "right-0.5" : "left-0.5"} ${
          TYPOGRAPHY.linearAccidental
        } ${colorClass}`}
      >
        {AccidentalFormatter.getAccidentalSignForDisplay(accidental)}
      </span>
    );
  };

  return (
    <div
      id={id}
      className={`${allBaseClasses} ${keyColors.primary} !${keyColors.border} ${KEY_BASE_CLASSES} ${
        isShortKey ? SHORT_KEY_CLASSES : TALL_KEY_CLASSES
      }`}
      style={{ left, width: keyWidthAsPercent }}
      onClick={onKeyClick ? () => onKeyClick(actualIndex) : undefined}
    >
      {doDisplayText && (
        <>
          {showLabels && !isShortKey && (
            <div
              className={`${TYPOGRAPHY.linearNoteText} ${NOTE_LABEL_CLASSES} ${keyColors.text}`}
            >
              {noteText}
            </div>
          )}
          {showLabels &&
            prevAccidentalExists &&
            renderAccidental(AccidentalType.Flat, prevAccidentalSelected)}
          {showLabels &&
            nextAccidentalExists &&
            renderAccidental(AccidentalType.Sharp, nextAccidentalSelected)}
        </>
      )}
    </div>
  );
};
