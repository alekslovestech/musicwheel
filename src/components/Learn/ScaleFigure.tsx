"use client";

import Link from "next/link";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { actualToChromatic } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";

/** One scale figure: the wheel, the keyboard, and a link to the live app. Read-only, client
 * component since MusicalKey is a class instance. */
export function ScaleFigure({
  tonic,
  scaleMode,
  caption,
  scalePlaybackMode = ScalePlaybackMode.SingleNote,
  highlightedDegree,
  showStepAnnotations = false,
}: {
  tonic: string;
  scaleMode: ScaleModeType;
  caption: string;
  scalePlaybackMode?: ScalePlaybackMode;
  /** Scale degree to highlight, under whichever scalePlaybackMode is active. Omit for a figure
   * with nothing highlighted - the scale's plain shape, or its step pattern. */
  highlightedDegree?: ScaleDegree;
  showStepAnnotations?: boolean;
}) {
  const musicalKey = MusicalKey.fromGreekMode(tonic, scaleMode);
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

      <LinearKeyboardView
        musicalKey={musicalKey}
        highlightedNoteIndices={highlightedNoteIndices}
        onKeyClick={null}
        isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
        useRealisticColors
        showAccidentalMarks={false}
        showNoteLabels={false}
        isCompact={musicalKey.tonicIndex === 0}
      />

      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({ tonic, scaleMode, playbackMode: scalePlaybackMode })}
          className={LEARN_STYLES.link}
        >
          Hear {tonic} {scaleMode} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
