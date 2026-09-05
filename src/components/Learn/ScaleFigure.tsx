"use client";

import Link from "next/link";

import { ScaleRibbon } from "@/components/ColorLegend/ScaleRibbon";
import { StaticKeyboardCircular } from "@/components/Keyboard/Circular/StaticKeyboardCircular";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

/**
 * One figure in a prose page: the wheel, the drone ribbon under it, and a link out to the same
 * scale in the live app. Everything visible is rendered from the app's own components, so the
 * figure stays in step with the palette; everything clickable lives behind the link, so the
 * article ships no playback and nothing to interact with.
 *
 * The client boundary sits here rather than deeper because MusicalKey and the ribbon's chroma
 * colors are class instances, which a server component cannot hand to a client one. Keeping the
 * seam at this component's plain string/number props means the article page around it - the prose
 * that actually gets indexed - stays server-rendered.
 */
export function ScaleFigure({
  tonic,
  scaleMode,
  highlightedDegree,
  caption,
}: {
  tonic: string;
  scaleMode: ScaleModeType;
  /** 1-based scale degree the wheel holds against the tonic drone. */
  highlightedDegree: number;
  caption: string;
}) {
  const playbackMode = ScalePlaybackMode.DronedSingleNote;
  const musicalKey = MusicalKey.fromGreekMode(tonic, scaleMode);
  const degreeIndex = ixScaleDegreeIndex(highlightedDegree - 1);
  const highlightedNoteIndices = musicalKey.getNoteIndicesForScaleDegree(degreeIndex, playbackMode);

  return (
    <figure className={LEARN_STYLES.figureCard}>
      <StaticKeyboardCircular
        musicalKey={musicalKey}
        highlightedNoteIndices={highlightedNoteIndices}
        scalePlaybackMode={playbackMode}
      />

      <ScaleRibbon
        ribbon={buildScaleRibbonData(musicalKey, playbackMode)}
        activeNoteIndex={highlightedDegree - 1}
      />

      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({ tonic, scaleMode, playbackMode })}
          className={LEARN_STYLES.link}
        >
          Hear {tonic} {scaleMode} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
