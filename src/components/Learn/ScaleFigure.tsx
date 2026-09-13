"use client";

import Link from "next/link";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { actualToChromatic } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { AnyScaleType, isOtherScaleType, scaleSelectionPath } from "@/utils/slug/scaleSelection";

// One scale figure: the wheel, optionally the keyboard, and a link to the live app. 
// Can handle both diatonic and non-diatonic scales

export function ScaleFigure({
  tonic,
  scaleType,
  caption,
  scalePlaybackMode = ScalePlaybackMode.SingleNote,
  highlightedDegree,
  showStepAnnotations = false,
  showLinearKeyboard = true,
  linearShowLabels = false,
  isCompact = false,
}: {
  tonic: string;
  scaleType: AnyScaleType;
  caption: string;
  /** Triad/Seventh are diatonic-only (see MusicalKey.getOffsets) - don't pass those for a
   * non-diatonic scaleType. */
  scalePlaybackMode?: ScalePlaybackMode;
  /** Scale degree to highlight, under whichever scalePlaybackMode is active. Omit for a figure
   * with nothing highlighted - the scale's plain shape, or its step pattern. */
  highlightedDegree?: ScaleDegree;
  showStepAnnotations?: boolean;
  showLinearKeyboard?: boolean;
  /** The note-name letter and accidental ticks on the linear keyboard - see PianoKeyLinear. */
  linearShowLabels?: boolean;
  /** Single-octave linear keyboard starting on C, instead of the full two-octave view - only
   * looks right when tonic is C, since a compact keyboard always starts there regardless of
   * tonic. See LinearKeyboardView.isCompact. */
  isCompact?: boolean;
}) {
  const musicalKey = isOtherScaleType(scaleType)
    ? MusicalKey.fromOtherScale(tonic, scaleType)
    : MusicalKey.fromGreekMode(tonic, scaleType);
  const highlightedNoteIndices =
    highlightedDegree == null
      ? []
      : musicalKey.getNoteIndicesForScaleDegree(
          scaleDegreeToIndex(highlightedDegree),
          scalePlaybackMode,
        );

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <CircularKeyboardView
        musicalKey={musicalKey}
        highlightedNoteIndices={highlightedNoteIndices}
        scalePlaybackMode={scalePlaybackMode}
        showStepAnnotations={showStepAnnotations}
        onKeyClick={null}
      />

      {showLinearKeyboard && (
        <LinearKeyboardView
          musicalKey={musicalKey}
          highlightedNoteIndices={highlightedNoteIndices}
          onKeyClick={null}
          isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
          useRealisticColors
          showLabels={linearShowLabels}
          isCompact={isCompact}
          showScaleBoundaryFlag
        />
      )}

      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({ tonic, scaleMode: scaleType, playbackMode: scalePlaybackMode })}
          className={LEARN_STYLES.link}
        >
          Hear {tonic} {scaleType} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
