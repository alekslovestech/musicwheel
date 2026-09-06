"use client";

import Link from "next/link";

import { ScaleRibbon } from "@/components/ColorLegend/ScaleRibbon";
import { StaticKeyboardCircular } from "@/components/Keyboard/Circular/StaticKeyboardCircular";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

/**
 * A single scale's shape, not a comparison: no drone, no highlighted degree. With
 * showStepAnnotations, the wheel and ribbon color the whole/half-step arc between every pair of
 * adjacent degrees - for articles illustrating where a scale's own gaps sit. Without it, the
 * wheel just shades which of the twelve keys are in the scale - for articles illustrating a
 * scale's raw note collection, e.g. that two differently-named scales share every note.
 */
export function SingleScaleFigure({
  tonic,
  scaleMode,
  caption,
  showStepAnnotations = true,
}: {
  tonic: string;
  scaleMode: ScaleModeType;
  caption: string;
  showStepAnnotations?: boolean;
}) {
  const playbackMode = ScalePlaybackMode.SingleNote;
  const musicalKey = MusicalKey.fromGreekMode(tonic, scaleMode);

  return (
    <figure className={LEARN_STYLES.figureCard}>
      <StaticKeyboardCircular musicalKey={musicalKey} showStepAnnotations={showStepAnnotations} />

      <ScaleRibbon ribbon={buildScaleRibbonData(musicalKey, playbackMode, showStepAnnotations)} />

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
