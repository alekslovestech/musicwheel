"use client";

import Link from "next/link";

import { ScaleRibbon } from "@/components/ColorLegend/ScaleRibbon";
import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

/**
 * One scale figure in a prose page: the wheel, the ribbon under it, and a link out to the same
 * scale in the live app. Everything visible is rendered from the app's own components, so a
 * figure stays in step with the palette; everything clickable lives behind the link, so the
 * article ships no playback and nothing to interact with.
 *
 * scalePlaybackMode covers the same ground the live Scales view does - not just SingleNote and
 * DronedSingleNote, but Triad and Seventh too, so an article can illustrate a specific chord (or
 * every diatonic chord) on a scale, not only a single note. highlightedDegree works under any of
 * them: droned, it colors one note against the tonic; under Triad/Seventh, it highlights that
 * degree's chord. showStepAnnotations only draws anything in SingleNote mode, matching the app's
 * own gating (`showsStepSegments`) - passing it alongside a highlighted degree or a chordal
 * playback mode is simply a no-op rather than a state the type system needs to forbid.
 *
 * The client boundary sits here rather than deeper because MusicalKey and the ribbon's chroma
 * colors are class instances, which a server component cannot hand to a client one. Keeping the
 * seam at this component's plain string/number props means the article page around it - the prose
 * that actually gets indexed - stays server-rendered.
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

      <ScaleRibbon
        ribbon={buildScaleRibbonData(musicalKey, scalePlaybackMode, showStepAnnotations)}
        activeDegreeIndex={highlightedDegree == null ? null : scaleDegreeToIndex(highlightedDegree)}
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
