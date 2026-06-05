import React from "react";

import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";

import { TYPOGRAPHY } from "@/lib/design/Typography";

import { actualToChromatic } from "@/types/IndexTypes";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { BLACK_KEY_WIDTH_RATIO, WHITE_KEYS_PER_2OCTAVES } from "@/types/constants/NoteConstants";

import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";
import { VisualStateUtils } from "@/utils/visual/VisualStateUtils";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
import { PianoKeyBaseProps } from "@/components/Keyboard/KeyboardBase";

import { useMusical } from "@/contexts/MusicalContext";
import { useDisplay } from "@/contexts/DisplayContext";

interface PianoKeyLinearProps extends PianoKeyBaseProps {
  doDisplayText: boolean;
}

export const PianoKeyLinear: React.FC<PianoKeyLinearProps> = ({
  actualIndex,
  isBassNote,
  doDisplayText,
  onKeyClick,
}) => {
  const { selectedMusicalKey, selectedNoteIndices } = useMusical();
  const { monochromeMode } = useDisplay();

  const chromaticIndex = actualToChromatic(actualIndex);
  const isShortKey = BlackKeyUtils.isBlackKey(chromaticIndex);
  const left = LinearKeyboardUtils.getKeyPosition(actualIndex);

  const baseClasses = ["key-base"];
  const isSelected = KeyboardUtils.isKeySelected(
    actualIndex,
    selectedNoteIndices,
    KeyboardUIType.Linear,
  );
  const isScales = useIsScalePreviewMode();
  const isDiatonicInScale =
    !isScales ||
    selectedMusicalKey.scaleModeInfo.isDiatonicNote(chromaticIndex, selectedMusicalKey.tonicIndex);

  const {
    prevAccidentalExists,
    nextAccidentalExists,
    prevAccidentalSelected,
    nextAccidentalSelected,
  } = KeyboardUtils.getAdjacentKeyState(chromaticIndex, selectedNoteIndices);

  const widthRatio = isShortKey ? BLACK_KEY_WIDTH_RATIO : 1;
  const keyWidthAsPercent = `${((widthRatio * 100) / WHITE_KEYS_PER_2OCTAVES).toFixed(2)}%`;

  const keyColors = VisualStateUtils.getKeyColors(
    chromaticIndex,
    isScales,
    selectedMusicalKey,
    monochromeMode,
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

  const renderAccidental = (accidental: AccidentalType, isSelected: boolean) => {    const isSharp = accidental === AccidentalType.Sharp;
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
      onClick={() => onKeyClick(actualIndex)}
    >
      {doDisplayText && (
        <>
          {!isShortKey && (
            <div
              className={`${TYPOGRAPHY.linearNoteText} text-center w-full leading-none mb-0.5 ${keyColors.text}`}
            >
              {noteText}
            </div>
          )}
          {prevAccidentalExists && renderAccidental(AccidentalType.Flat, prevAccidentalSelected)}
          {nextAccidentalExists && renderAccidental(AccidentalType.Sharp, nextAccidentalSelected)}
        </>
      )}
    </div>
  );
};
