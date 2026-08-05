"use client";
import React from "react";

import { actualToChromatic } from "@/types/IndexTypes";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { PianoKeyBaseProps } from "@/components/Keyboard/KeyboardBase";

import { CartesianPoint, CartesianPointPair } from "@/types/interfaces/CartesianPoint";

import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { TYPOGRAPHY } from "@/lib/design/Typography";

import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
import { ArcPathVisualizer } from "@/utils/Keyboard/Circular/ArcPathVisualizer";
import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { VisualStateUtils } from "@/utils/visual/VisualStateUtils";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";

import { useMusical } from "@/contexts/MusicalContext";
import { useAudio } from "@/contexts/AudioContext";

interface PianoKeyCircularProps extends PianoKeyBaseProps {
  outerRadius: number;
  innerRadius: number;
}

export const PianoKeyCircular: React.FC<PianoKeyCircularProps> = ({
  actualIndex,
  isBassNote,
  outerRadius,
  innerRadius,
  onKeyClick,
}) => {
  const { selectedMusicalKey, selectedNoteIndices } = useMusical();
  const { scalePlaybackMode } = useAudio();
  const chromaticIndex = actualToChromatic(actualIndex);
  const pathData = ArcPathVisualizer.getArcPathData(chromaticIndex, outerRadius, innerRadius);
  const textPoint = ArcPathVisualizer.getTextPoint(chromaticIndex, outerRadius, innerRadius);

  const baseClasses = ["key-base"];
  const isSelected = KeyboardUtils.isKeySelected(
    actualIndex,
    selectedNoteIndices,
    KeyboardUIType.Circular,
  );
  const isScales = useIsScalePreviewMode();
  const isBlack = BlackKeyUtils.isBlackKey(chromaticIndex);
  const isDiatonicInScale =
    !isScales ||
    selectedMusicalKey.scaleModeInfo.isDiatonicNote(chromaticIndex, selectedMusicalKey.tonicIndex);

  // Add color classes based on visual state and selection
  const keyColors = VisualStateUtils.getKeyColors(
    chromaticIndex,
    isScales,
    selectedMusicalKey,
    false,
    isBlack,
    isSelected,
    true,
  );

  const allBaseClasses = KeyboardUtils.buildKeyClasses(
    baseClasses,
    isSelected,
    isBlack,
    isScales,
    isBassNote,
    isDiatonicInScale,
  );

  const id = KeyboardUtils.StringWithPaddedIndex("circularKey", actualIndex);
  const noteText = KeyboardUtils.getNoteText(
    KeyboardUIType.Circular,
    chromaticIndex,
    isScales,
    selectedMusicalKey,
    scalePlaybackMode,
  );

  const isRomanLabels = isScales && KeyboardUtils.usesRomanScaleLabels(scalePlaybackMode);
  const romanLabelFit = isRomanLabels
    ? ArcPathVisualizer.getRomanLabelFit(noteText, outerRadius, innerRadius)
    : undefined;
  const noteTextClass = romanLabelFit
    ? "font-bold"
    : isRomanLabels
      ? TYPOGRAPHY.circularRomanText
      : TYPOGRAPHY.circularNoteText;

  const renderAccidental = (
    accidental: AccidentalType,
    textPoint: CartesianPoint,
    isSelected: boolean,
  ) => {
    const colorClass = VisualStateUtils.getTextColorClassForNonScaleMode(
      isSelected,
      isBlack,
      true, // isSvg
    );
    return (
      <text
        x={textPoint.x}
        y={textPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`text-center pointer-events-none ${TYPOGRAPHY.circularAccidental} ${colorClass}`}
      >
        {AccidentalFormatter.getAccidentalSignForDisplay(accidental)}
      </text>
    );
  };

  const textPointAccidentals: CartesianPointPair = ArcPathVisualizer.getAccidentalPositions(
    chromaticIndex,
    outerRadius,
    innerRadius,
  );

  return (
    <g
      id={id}
      className={`${allBaseClasses} !${keyColors.border} hover:[&_path]:opacity-80`}
      onClick={() => onKeyClick(actualIndex)}
    >
      <path d={pathData} className={`${keyColors.primary} stroke-keys-strokeOutline stroke-1`} />
      <text
        x={textPoint.x}
        y={textPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={romanLabelFit?.fontSize}
        textLength={romanLabelFit?.textLength}
        lengthAdjust={romanLabelFit !== undefined ? "spacingAndGlyphs" : undefined}
        className={`text-center pointer-events-none ${keyColors.text} ${noteTextClass}`}
      >
        {noteText}
      </text>
      {!isScales && isBlack && (
        <>
          {renderAccidental(AccidentalType.Sharp, textPointAccidentals.start, isSelected)}
          {renderAccidental(AccidentalType.Flat, textPointAccidentals.end, isSelected)}
        </>
      )}
    </g>
  );
};
