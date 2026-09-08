import React from "react";

import { TYPOGRAPHY } from "@/lib/design/Typography";

import { ActualIndex, actualToChromatic, NoteIndices } from "@/types/IndexTypes";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { BLACK_KEY_WIDTH_RATIO, WHITE_KEYS_PER_2OCTAVES } from "@/types/constants/NoteConstants";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";
import { VisualStateUtils } from "@/utils/visual/VisualStateUtils";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";

interface PianoKeyLinearProps {
  actualIndex: ActualIndex;
  isBassNote: boolean;
  doDisplayText: boolean;
  /** Pass null for a read-only keyboard, for the static wheel article figures embed. */
  onKeyClick: ((index: ActualIndex) => void) | null;
  selectedMusicalKey: MusicalKey;
  selectedNoteIndices: NoteIndices;
  isScales: boolean;
  /** Real black/white key colors instead of the live app's blue Scales-mode theme. */
  useRealisticColors?: boolean;
  /** The small ♯/♭ ticks on a white key's edge marking its black-key neighbor. */
  showAccidentalMarks?: boolean;
  /** The note-name letter on white keys (black keys never get one). */
  showNoteLabels?: boolean;
  /** Geometry override. Default computes both from actualIndex for a two-octave keyboard starting
   * at C - see LinearKeyboardView's singleOctaveFromTonic for the other case. */
  left?: string;
  widthPercent?: string;
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
  showAccidentalMarks = true,
  showNoteLabels = true,
  left: leftOverride,
  widthPercent: widthPercentOverride,
}) => {
  const chromaticIndex = actualToChromatic(actualIndex);
  const isShortKey = BlackKeyUtils.isBlackKey(chromaticIndex);
  const left = leftOverride ?? LinearKeyboardUtils.getKeyPosition(actualIndex);

  const baseClasses = ["key-base"];
  const isSelected = KeyboardUtils.isKeySelected(
    actualIndex,
    selectedNoteIndices,
    KeyboardUIType.Linear,
  );
  const isDiatonicInScale = !isScales || selectedMusicalKey.isDiatonicNote(chromaticIndex);

  const {
    prevAccidentalExists,
    nextAccidentalExists,
    prevAccidentalSelected,
    nextAccidentalSelected,
  } = KeyboardUtils.getAdjacentKeyState(chromaticIndex, selectedNoteIndices);

  const widthRatio = isShortKey ? BLACK_KEY_WIDTH_RATIO : 1;
  const keyWidthAsPercent =
    widthPercentOverride ?? `${((widthRatio * 100) / WHITE_KEYS_PER_2OCTAVES).toFixed(2)}%`;

  const keyColors = useRealisticColors
    ? VisualStateUtils.getRealisticScaleKeyColors(
        isShortKey,
        isDiatonicInScale,
        isSelected,
        isBassNote,
        false,
      )
    : VisualStateUtils.getKeyColors(
        chromaticIndex,
        isScales,
        selectedMusicalKey,
        isBassNote,
        isShortKey,
        isSelected,
        false,
      );

  const allBaseClasses = KeyboardUtils.buildKeyClasses(
    baseClasses,
    isSelected,
    isShortKey,
    isScales,
    isBassNote,
    isDiatonicInScale,
  );

  const id = KeyboardUtils.StringWithPaddedIndex("linearKey", actualIndex);
  const noteText = KeyboardUtils.getNoteText(
    KeyboardUIType.Linear,
    chromaticIndex,
    isScales,
    selectedMusicalKey,
  );

  const renderAccidental = (accidental: AccidentalType, isSelected: boolean) => {
    const isSharp = accidental === AccidentalType.Sharp;
    const colorClass = VisualStateUtils.getTextColorClassForNonScaleMode(
      isSelected,
      false, // isBlack: Accidentals are on white keys in linear keyboard
      false, // isSvg
    );
    return (
      <span
        className={`absolute ${isSharp ? "right-0.5" : "left-0.5"} top-2/3 -translate-y-1/2 ${
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
      className={`${allBaseClasses} ${keyColors.primary} !${
        keyColors.border
      } absolute box-border flex ${
        isShortKey ? "h-[60%] -translate-x-1/2 z-[2]" : "h-full z-[1]"
      } ${isShortKey ? "" : "items-end"} shadow-linear-key`}
      style={{ left, width: keyWidthAsPercent }}
      onClick={onKeyClick ? () => onKeyClick(actualIndex) : undefined}
    >
      {doDisplayText && (
        <>
          {showNoteLabels && !isShortKey && (
            <div
              className={`${TYPOGRAPHY.linearNoteText} text-center w-full leading-none mb-0.5 ${keyColors.text}`}
            >
              {noteText}
            </div>
          )}
          {showAccidentalMarks &&
            prevAccidentalExists &&
            renderAccidental(AccidentalType.Flat, prevAccidentalSelected)}
          {showAccidentalMarks &&
            nextAccidentalExists &&
            renderAccidental(AccidentalType.Sharp, nextAccidentalSelected)}
        </>
      )}
    </div>
  );
};
