"use client";

import Link from "next/link";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { actualToChromatic } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";

/**
 * One scale figure in a prose page: the wheel, the keyboard, and a link out to the same scale in
 * the live app. Read-only - nothing here is interactive.
 *
 * The client boundary sits here because MusicalKey is a class instance, which a server component
 * can't hand to a client one.
 */
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
    <figure className={LEARN_STYLES.figureCard}>
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
        singleOctaveFromTonic
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
