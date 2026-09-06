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
 * A single scale's shape, not a comparison: the wheel and ribbon both show the whole/half-step
 * coloring between every pair of adjacent degrees instead of highlighting one degree against a
 * drone. For concept articles illustrating a scale's own structure - e.g. where its stretched,
 * augmented-second gap sits - rather than what changed relative to another scale.
 */
export function StepAnnotatedScaleFigure({
  tonic,
  scaleMode,
  caption,
}: {
  tonic: string;
  scaleMode: ScaleModeType;
  caption: string;
}) {
  const playbackMode = ScalePlaybackMode.SingleNote;
  const musicalKey = MusicalKey.fromGreekMode(tonic, scaleMode);

  return (
    <figure className={LEARN_STYLES.figureCard}>
      <StaticKeyboardCircular musicalKey={musicalKey} showStepAnnotations />

      <ScaleRibbon ribbon={buildScaleRibbonData(musicalKey, playbackMode, true)} />

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
